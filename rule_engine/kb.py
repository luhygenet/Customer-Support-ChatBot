# app/kb.py

products = [
    {"product_id": "P001", "name": "Wireless Mouse", "price": 25, "warranty_months": 12, "returnable": True},
    {"product_id": "P002", "name": "Mechanical Keyboard", "price": 80, "warranty_months": 24, "returnable": True},
]

orders = [
    {"order_id": "O123", "product_id": "P001", "customer_id": "C001", "order_date": "2025-01-10", "status": "delivered"},
    {"order_id": "O124", "product_id": "P002", "customer_id": "C002", "order_date": "2025-01-12", "status": "shipped"},
]

policies = [
    {"policy_id": "return_policy", "conditions": ["within_30_days", "product_returnable"], "description": "Products can be returned within 30 days if returnable"},
    {"policy_id": "warranty_policy", "conditions": ["within_warranty_period"], "description": "Warranty applies for the defined months after purchase"},
]
