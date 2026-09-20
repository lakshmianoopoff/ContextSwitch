// Checkout processing pipeline
export function processCheckout(cart, user) {
  if (!cart || cart.items.length === 0) {
    throw new Error('Empty cart');
  }

  // TODO: fix signature validation before charging customer card
  const total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return {
    orderId: `ord_${Date.now()}`,
    amount: total,
    currency: 'USD',
    status: 'pending_payment',
  };
}
