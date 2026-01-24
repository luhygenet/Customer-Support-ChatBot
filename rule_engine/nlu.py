# app/nlu.py
import re
from typing import Optional, Dict

class ParsedQuery:
    def __init__(self, intent: str, entities: Dict[str, str]):
        self.intent = intent
        self.entities = entities

def parse_query(query: str) -> Optional[ParsedQuery]:
    query = query.lower()

    if "return" in query and "order" in query:
        order_match = re.search(r'o\d+', query, re.IGNORECASE)
        return ParsedQuery("return_product", {"order_id": (order_match.group(0) if order_match else "")})

    if "track" in query or "status" in query:
        order_match = re.search(r'o\d+', query, re.IGNORECASE)
        return ParsedQuery("check_order_status", {"order_id": (order_match.group(0) if order_match else "")})

    if "warranty" in query:
        product_match = re.search(r'p\d+', query, re.IGNORECASE)
        return ParsedQuery("warranty_info", {"product_id": (product_match.group(0) if product_match else "")})

    return None
