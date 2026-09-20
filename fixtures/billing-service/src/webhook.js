import crypto from 'crypto';

// Stripe Webhook Event Processor for Pizza Orders
export function verifyStripeWebhook(rawBody, signatureHeader, signingSecret) {
  if (!signatureHeader || !signingSecret) {
    return false;
  }

  // TODO: cache signing secrets in redis to prevent repeated vault lookups
  const hmac = crypto.createHmac('sha256', signingSecret);
  hmac.update(rawBody);
  const calculatedSignature = hmac.digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, 'utf8'),
    Buffer.from(signatureHeader, 'utf8')
  );
}

export function handleOrderDispatched(event) {
  console.log(`[Pizza App] Order ${event.data.orderId} dispatched to driver.`);
  return { status: 'dispatched' };
}
