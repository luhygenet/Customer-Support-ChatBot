export type Intent = 'check_order_status' | 'return_product' | 'warranty_info';

export interface ParsedQuery {
  intent: Intent;
  entities: { [key: string]: string };
}

export function parseQuery(query: string): ParsedQuery | null {
  query = query.toLowerCase();

  if (query.includes('return') && query.includes('order')) {
    console.log("seen return and order")
    const orderMatch = query.match(/o\d+/i);
    return { intent: 'return_product', entities: { order_id: orderMatch?.[0] || '' } };
  }

  if (query.includes('track') || query.includes('status')) {
    const orderMatch = query.match(/o\d+/i);
    return { intent: 'check_order_status', entities: { order_id: orderMatch?.[0] || '' } };
  }

  if (query.includes('warranty')) {
    const productMatch = query.match(/p\d+/i);
    return { intent: 'warranty_info', entities: { product_id: productMatch?.[0] || '' } };
  }

  return null;
}
