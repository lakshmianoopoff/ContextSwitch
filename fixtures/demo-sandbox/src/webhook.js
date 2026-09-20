import crypto from 'crypto';

// Stripe webhook handler
export function handleStripeWebhook(rawPayload, signature, secret) {
  // TODO: verify HMAC SHA256 signature with timingSafeEqual
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawPayload);
  return hmac.digest('hex') === signature;
}
