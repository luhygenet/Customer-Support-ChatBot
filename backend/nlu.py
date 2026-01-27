# app/nlu.py
from __future__ import annotations

import re
from functools import lru_cache
from typing import Dict, Optional

import spacy
from spacy.language import Language
from spacy.pipeline import EntityRuler

from knowledge_base import get_products


class ParsedQuery:
    def __init__(self, intent: str, entities: Dict[str, str]):
        self.intent = intent
        self.entities = entities


NAME_TO_ID: Dict[str, str] = {}


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


def infer_intent(text: str) -> Optional[str]:
    t = text.lower()
    if "return" in t:
        return "return_product"
    if "track" in t or "status" in t:
        return "check_order_status"
    if "warranty" in t:
        return "warranty_info"
    return None


def parse_query(query: str) -> Optional[ParsedQuery]:
    nlp = get_nlp()
    doc = nlp(query)

    entities: Dict[str, str] = {}
    for ent in doc.ents:
        if ent.label_ == "ORDER_ID":
            entities["order_id"] = ent.text.upper()
        elif ent.label_ == "PRODUCT_ID":
            entities["product_id"] = ent.text.upper()
        elif ent.label_ == "PRODUCT_NAME":
            product_id = NAME_TO_ID.get(ent.text.lower())
            if product_id:
                entities["product_id"] = product_id

    intent = infer_intent(query)

    if not intent:
        return None

    # Fallback: regex for IDs if NER missed them
    if "order_id" not in entities:
        m = re.search(r"o\d+", query, re.IGNORECASE)
        if m:
            entities["order_id"] = m.group(0).upper()
    if "product_id" not in entities:
        m = re.search(r"p\d+", query, re.IGNORECASE)
        if m:
            entities["product_id"] = m.group(0).upper()

    return ParsedQuery(intent, entities)
