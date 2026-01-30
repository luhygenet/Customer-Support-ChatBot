# app/nlu.py
from __future__ import annotations

import json
import os
import re
from functools import lru_cache
from typing import Dict, List, Optional, Tuple

from dotenv import load_dotenv
from google import genai
import spacy
from spacy.language import Language
from spacy.pipeline import EntityRuler

from knowledge_base import get_products


class ParsedQuery:
    def __init__(self, intent: str, entities: Dict[str, str], trace: Optional[List[str]] = None, text: str = ""):
        self.intent = intent
        self.entities = entities
        self.trace = trace or []
        self.text = text


load_dotenv()

NAME_TO_ID: Dict[str, str] = {}
SUPPORTED_INTENTS = {
    "check_order_status",
    "return_product",
    "warranty_info",
    "warranty_policy_info",
    "return_policy_info",
    "shipping_info",
    "cancellation_info",
    "digital_goods_policy",
}


def _build_name_gazetteer() -> Dict[str, str]:
    products = get_products()
    return {p["name"].lower(): p["product_id"].upper() for p in products if p.get("name") and p.get("product_id")}


@lru_cache(maxsize=1)
def get_nlp() -> Language:
    """
    Load spaCy model with an EntityRuler for order IDs, product IDs, and policy keywords.
    Requires `python -m spacy download en_core_web_sm` once.
    """
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError as exc:
        raise RuntimeError(
            "spaCy model 'en_core_web_sm' is not installed. Run: python -m spacy download en_core_web_sm"
        ) from exc

    # Ensure EntityRuler exists and add patterns
    if "entity_ruler" not in nlp.pipe_names:
        ruler = nlp.add_pipe("entity_ruler")
    else:
        ruler = nlp.get_pipe("entity_ruler")

    # Build gazetteer for product names
    global NAME_TO_ID
    if not NAME_TO_ID:
        NAME_TO_ID = _build_name_gazetteer()

    # Entity patterns
    patterns = [
        {"label": "ORDER_ID", "pattern": [{"TEXT": {"REGEX": r"o\d+"}}]},
        {"label": "ORDER_ID", "pattern": [{"TEXT": {"REGEX": r"ord-?\d+"}}]},
        {"label": "ORDER_ID", "pattern": [{"TEXT": {"REGEX": r"order-?\d+"}}]},
        {"label": "PRODUCT_ID", "pattern": [{"TEXT": {"REGEX": r"p\d+"}}]},
        {"label": "POLICY", "pattern": [{"LOWER": {"IN": ["return", "warranty", "shipping", "cancellation"]}}]},
    ]

    # Add product-name patterns (tokenized, case-insensitive)
    for name in NAME_TO_ID.keys():
        token_pattern = [{"LOWER": part} for part in name.split()]
        patterns.append({"label": "PRODUCT_NAME", "pattern": token_pattern})

    # Avoid duplicating patterns on repeated calls
    existing = {p.get("label", "") for p in ruler.patterns}
    if not existing.intersection({"ORDER_ID", "PRODUCT_ID", "POLICY"}):
        ruler.add_patterns(patterns)

    return nlp


@lru_cache(maxsize=1)
def _get_intent_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set. Add it to .env to enable intent detection.")
    return genai.Client(api_key=api_key)


def infer_intent_fallback(text: str) -> Optional[str]:
    t = text.lower()
    if "warranty policy" in t:
        return "warranty_policy_info"
    if "return" in t or "refund" in t:
        return "return_product"
    if "track" in t or "status" in t or "where is" in t:
        return "check_order_status"
    if "warranty" in t:
        return "warranty_info"
    if "shipping" in t or "delivery" in t:
        return "shipping_info"
    if "cancel" in t or "cancellation" in t:
        return "cancellation_info"
    if "digital" in t or "software" in t or "license" in t:
        return "digital_goods_policy"
    if "return policy" in t or "refund policy" in t:
        return "return_policy_info"
    return None


def infer_general_intent(text: str) -> Optional[str]:
    t = text.lower()
    greetings = ["hi", "hello", "good morning", "good afternoon", "good evening", "hey"]
    farewells = ["bye", "goodbye", "see you"]
    thanks = ["thank", "thanks", "thx"]

    for word in greetings:
        if re.search(rf"\b{re.escape(word)}\b", t):
            return "greeting"
    for word in farewells:
        if re.search(rf"\b{re.escape(word)}\b", t):
            return "farewell"
    for word in thanks:
        if re.search(rf"\b{re.escape(word)}\b", t):
            return "thanks"
    return None

def infer_intent_transformer(text: str) -> Tuple[Optional[str], str]:
    client = _get_intent_client()

    # Hardcode the model you want to use
    model_name = "gemini-2.5-flash"

    prompt = (
        "You are an intent classifier for a customer support chatbot. "
        "Your task is to classify the user's message into one of these intents: "
        "check_order_status, return_product, warranty_info, warranty_policy_info, "
        "return_policy_info, shipping_info, cancellation_info, digital_goods_policy, unknown. "
        "You MUST return ONLY a single valid JSON object with exactly two keys: "
        "'intent' and 'confidence'. Confidence is a number between 0 and 1. "
        "Do NOT include explanations, greetings, examples, or any other text. "
        "Output MUST be parseable as JSON. "
        "Example output: {\"intent\": \"return_product\", \"confidence\": 0.95} "
        f"Message: {text}"
    )

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config={
                "temperature": 0,
                "max_output_tokens": 100,
                "response_mime_type": "application/json",
            },
        )
    except Exception as exc:
        return None, f"error: {exc}"

    raw = getattr(response, "text", "") or ""
    raw = re.sub(r"^```(json)?|```$", "", raw.strip(), flags=re.IGNORECASE)

    # Extract first JSON object
    json_match = re.search(r"\{.*?\}", raw, flags=re.DOTALL)
    if not json_match:
        return None, f"model={model_name} non-json response: {raw}"

    try:
        data = json.loads(json_match.group(0))
        intent = data.get("intent")
        if intent in SUPPORTED_INTENTS:
            return intent, f"model={model_name} raw: {json_match.group(0)}"
        if intent in {"refund_request", "return_request"}:
            return "return_product", f"model={model_name} raw: {json_match.group(0)}"
        return "unknown", f"model={model_name} raw: {json_match.group(0)}"
    except json.JSONDecodeError:
        return None, f"model={model_name} invalid json: {json_match.group(0)}"


def parse_query(query: str) -> Optional[ParsedQuery]:
    general_intent = infer_general_intent(query)
    if general_intent:
        return ParsedQuery(general_intent, {}, [f"Intent: {general_intent}"], text=query)

    nlp = get_nlp()
    doc = nlp(query)

    entities: Dict[str, str] = {}
    for ent in doc.ents:
        if ent.label_ == "ORDER_ID":
            entities["order_id"] = ent.text.upper().replace(" ", "")
        elif ent.label_ == "PRODUCT_ID":
            entities["product_id"] = ent.text.upper()
        elif ent.label_ == "PRODUCT_NAME":
            product_id = NAME_TO_ID.get(ent.text.lower())
            if product_id:
                entities["product_id"] = product_id

    if "product_id" not in entities:
        query_lower = query.lower()
        best_match = None
        for name, pid in NAME_TO_ID.items():
            if re.search(rf"\b{re.escape(name)}\b", query_lower):
                if not best_match or len(name) > len(best_match[0]):
                    best_match = (name, pid)
        if best_match:
            entities["product_id"] = best_match[1]

    trace: List[str] = []
    intent: Optional[str] = None
    try:
        intent, transformer_debug = infer_intent_transformer(query)
        print(f"Intent (Transformer Debug): {transformer_debug}")
    except RuntimeError as exc:
        print(f"Intent (Transformer Error): {exc}")

    if not intent:
        intent = infer_intent_fallback(query)

    if not intent:
        return None

    trace.append(f"Intent: {intent}")

    # Fallback: regex for IDs if NER missed them
    if "order_id" not in entities:
        m = re.search(r"(o\d+|ord-?\d+|order-?\d+)", query, re.IGNORECASE)
        if m:
            entities["order_id"] = m.group(0).upper()
    if "product_id" not in entities:
        m = re.search(r"p\d+", query, re.IGNORECASE)
        if m:
            entities["product_id"] = m.group(0).upper()

    if entities:
        trace.append("Entities: " + ", ".join(f"{k}={v}" for k, v in entities.items()))
    else:
        trace.append("Entities: none")

    return ParsedQuery(intent, entities, trace, text=query)
