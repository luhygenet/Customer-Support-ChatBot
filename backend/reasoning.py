# app/reasoning.py
from datetime import datetime
from knowledge_base import get_products, get_orders, get_policies
from nlu import ParsedQuery

def reason_query(parsed: ParsedQuery):
    reasoning = []

    if not parsed:
        return {"answer": "Sorry, I could not understand your query.", "reasoning": reasoning}

    intent = parsed.intent
    entities = parsed.entities

    if intent == "check_order_status":
        orders = get_orders()
        order = next((o for o in orders if o["order_id"].lower() == entities["order_id"].lower()), None)
        if not order:
            reasoning.append("Order not found in database")
            return {"answer": "I couldn't find that order. Double-check the order ID.", "reasoning": reasoning}
        reasoning.append(f"Lookup: order {order['order_id']} status is {order['status']}")
        return {
            "answer": f"Order {order['order_id']} is currently {order['status']}. We'll keep you posted on updates.",
            "reasoning": reasoning,
        }

    elif intent == "return_product":
        orders = get_orders()
        order = next((o for o in orders if o["order_id"].lower() == entities["order_id"].lower()), None)
        if not order:
            reasoning.append("Order not found in database")
            return {"answer": "I couldn't find that order. Please verify the order ID.", "reasoning": reasoning}

        products = get_products()
        product = next((p for p in products if p["product_id"] == order["product_id"]), None)
        if not product:
            reasoning.append("Product not found for this order")
            return {"answer": "I couldn't find the product for that order.", "reasoning": reasoning}

        # Policy reference (if present)
        policies = get_policies()
        return_policy = next((p for p in policies if p.get("policy_id") == "return_policy"), None)
        policy_text = (
            return_policy.get("description")
            if return_policy
            else "Returns are allowed for returnable items within 30 days."
        )

        order_date = datetime.strptime(order["order_date"], "%Y-%m-%d")
        days_since_delivery = (datetime.now() - order_date).days

        reasoning.append(f"Policy: {policy_text}")
        reasoning.append(f"Product returnable flag: {product['returnable']}")
        reasoning.append(f"Days since order: {days_since_delivery}")

        if not product["returnable"]:
            reasoning.append("Declined: item is not marked returnable.")
            return {
                "answer": (
                    f"I can't create a return for order {order['order_id']} because this item isn't returnable. "
                    f"Policy: {policy_text}"
                ),
                "reasoning": reasoning,
            }

        if days_since_delivery <= 30:
            reasoning.append("Approved: within 30-day window and returnable.")
            return {
                "answer": (
                    f"Yes, you can return order {order['order_id']}. It's returnable and within the 30-day return window. "
                    f"Policy: {policy_text}"
                ),
                "reasoning": reasoning,
            }

        reasoning.append("Declined: outside 30-day window.")
        return {
            "answer": (
                f"I can't process a return for order {order['order_id']} because it's past the 30-day window. "
                f"Policy: {policy_text}"
            ),
            "reasoning": reasoning,
        }

    elif intent == "warranty_info":
        products = get_products()
        product = next((p for p in products if p["product_id"].lower() == entities["product_id"].lower()), None)
        if not product:
            reasoning.append("Product not found")
            return {"answer": "I couldn't find that product. Please check the product ID.", "reasoning": reasoning}

        months = product.get("warranty_months", 0)
        reasoning.append(f"Warranty period: {months} months")

        if months > 0:
            return {
                "answer": f"Yes—{product['name']} includes a {months}-month warranty from the purchase date.",
                "reasoning": reasoning,
            }
        return {
            "answer": f"{product['name']} does not include warranty coverage.",
            "reasoning": reasoning,
        }

    return {"answer": "Unknown intent.", "reasoning": reasoning}