# app/reasoning.py
from datetime import datetime
from kb import products, orders
from nlu import ParsedQuery

def reason_query(parsed: ParsedQuery):
    reasoning = []

    if not parsed:
        return {"answer": "Sorry, I could not understand your query.", "reasoning": reasoning}

    intent = parsed.intent
    entities = parsed.entities

    if intent == "check_order_status":
        order = next((o for o in orders if o["order_id"].lower() == entities["order_id"].lower()), None)
        if not order:
            reasoning.append("Order not found in database")
            return {"answer": "Order not found.", "reasoning": reasoning}
        reasoning.append(f"Found order {order['order_id']} with status: {order['status']}")
        return {"answer": f"Order {order['order_id']} is currently {order['status']}.", "reasoning": reasoning}

    elif intent == "return_product":
        order = next((o for o in orders if o["order_id"].lower() == entities["order_id"].lower()), None)
        if not order:
            reasoning.append("Order not found in database")
            return {"answer": "Order not found.", "reasoning": reasoning}

        product = next((p for p in products if p["product_id"] == order["product_id"]), None)
        if not product:
            reasoning.append("Product not found for this order")
            return {"answer": "Product not found.", "reasoning": reasoning}

        order_date = datetime.strptime(order["order_date"], "%Y-%m-%d")
        days_since_delivery = (datetime.now() - order_date).days

        reasoning.append(f"Product returnable: {product['returnable']}")
        reasoning.append(f"Days since order: {days_since_delivery}")

        if product["returnable"] and days_since_delivery <= 30:
            reasoning.append("Return allowed according to policy.")
            return {"answer": f"Return allowed for order {order['order_id']}.", "reasoning": reasoning}
        else:
            reasoning.append("Return not allowed according to policy.")
            return {"answer": f"Return not allowed for order {order['order_id']}.", "reasoning": reasoning}

    elif intent == "warranty_info":
        product = next((p for p in products if p["product_id"].lower() == entities["product_id"].lower()), None)
        if not product:
            reasoning.append("Product not found")
            return {"answer": "Product not found.", "reasoning": reasoning}
        reasoning.append(f"Warranty period: {product['warranty_months']} months")
        return {"answer": f"Product {product['name']} has a warranty of {product['warranty_months']} months.", "reasoning": reasoning}

    return {"answer": "Unknown intent.", "reasoning": reasoning}