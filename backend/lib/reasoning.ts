import { products, orders, policies } from "./knowledge_base";
import { ParsedQuery, Intent } from "./nlu";

export interface Response {
  answer: string;
  reasoning: string[];
}

export function reasonQuery(parsed: ParsedQuery): Response {
  const reasoning: string[] = [];

  if (!parsed)
    return { answer: "Sorry, I could not understand your query.", reasoning };

  const { intent, entities } = parsed;
  console.log("Reasoning about intent:", intent, "with entities:", entities);

  switch (intent) {
    case "check_order_status": {
      const order = orders.find((o) => {
        console.log("comparing", o.order_id, "to", entities.order_id);
        return o.order_id.toLowerCase() === entities.order_id;
      });
      if (!order) {
        reasoning.push("Order not found in database");
        return { answer: "Order not found.", reasoning };
      }
      reasoning.push(
        `Found order ${order.order_id} with status: ${order.status}`,
      );
      return {
        answer: `Order ${order.order_id} is currently ${order.status}.`,
        reasoning,
      };
    }

    case "return_product": {
      const order = orders.find(
        (o) => o.order_id.toLowerCase() === entities.order_id,
      );
      if (!order) {
        reasoning.push("Order not found in database");
        return { answer: "Order not found.", reasoning };
      }
      const product = products.find((p) => p.product_id === order.product_id);
      if (!product) {
        reasoning.push("Product not found for this order");
        return { answer: "Product not found.", reasoning };
      }

      // Example return rule: must be returnable and within 30 days
      const orderDate = new Date(order.order_date);
      const today = new Date();
      const daysSinceDelivery = Math.floor(
        (today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      reasoning.push(`Product returnable: ${product.returnable}`);
      reasoning.push(`Days since order: ${daysSinceDelivery}`);

      if (product.returnable && daysSinceDelivery <= 30) {
        reasoning.push("Return allowed according to policy.");
        return {
          answer: `Return allowed for order ${order.order_id}.`,
          reasoning,
        };
      } else {
        reasoning.push("Return not allowed according to policy.");
        return {
          answer: `Return not allowed for order ${order.order_id}.`,
          reasoning,
        };
      }
    }

    case "warranty_info": {
      const product = products.find(
        (p) => p.product_id.toLowerCase() === entities.product_id,
      );
      if (!product) {
        reasoning.push("Product not found");
        return { answer: "Product not found.", reasoning };
      }
      reasoning.push(`Warranty period: ${product.warranty_months} months`);
      return {
        answer: `Product ${product.name} has a warranty of ${product.warranty_months} months.`,
        reasoning,
      };
    }

    default:
      return { answer: "Unknown intent.", reasoning };
  }
}
