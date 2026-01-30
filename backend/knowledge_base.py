from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List


@lru_cache(maxsize=1)
def knowledge_base() -> Dict[str, Any]:
    """
    Load and return the structured knowledge base.

    This function abstracts the data source. Currently it loads from
    knowledge_base.json, but can be swapped to a database or API later
    without changing downstream code.
    """
    data_path = Path(__file__).parent / "knowledge_base.json"
    with data_path.open() as f:
        return json.load(f)


def get_products() -> List[Dict[str, Any]]:
    return knowledge_base().get("products", [])


def get_orders() -> List[Dict[str, Any]]:
    return knowledge_base().get("orders", [])


def get_policies() -> List[Dict[str, Any]]:
    return knowledge_base().get("policies", [])


