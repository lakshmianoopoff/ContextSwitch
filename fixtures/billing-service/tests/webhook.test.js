import test from 'node:test';
import assert from 'node:assert';
import { calculateSubtotal, calculateTax, calculateDeliveryFee } from '../src/checkout.js';
import { verifyStripeWebhook } from '../src/webhook.js';

// 12 passing unit tests
test('calculates subtotal for single pizza', () => {
  assert.strictEqual(calculateSubtotal([{ name: 'Margherita', price: 14, size: 'medium' }]), 14);
});

test('calculates subtotal for multiple pizzas', () => {
  assert.strictEqual(calculateSubtotal([
    { name: 'Pepperoni', price: 16, size: 'large' },
    { name: 'Quattro Formaggi', price: 18, size: 'large' }
  ]), 34);
});

test('calculates tax rate properly', () => {
  assert.strictEqual(calculateTax(100, 0.08), 8.00);
});

test('calculates delivery fee under 3 miles', () => {
  assert.strictEqual(calculateDeliveryFee(2.5), 2.99);
});

test('calculates delivery fee under 10 miles', () => {
  assert.strictEqual(calculateDeliveryFee(7.2), 4.99);
});

test('calculates delivery fee over 10 miles', () => {
  assert.strictEqual(calculateDeliveryFee(15.0), 7.99);
});

test('validates minimum cart size', () => {
  assert.strictEqual(calculateSubtotal([]), 0);
});

test('handles decimal prices correctly', () => {
  assert.strictEqual(calculateSubtotal([{ name: 'Extra Dip', price: 1.5, size: 'small' }]), 1.5);
});

test('rounds tax properly on fractions', () => {
  assert.strictEqual(calculateTax(15.99, 0.0825), 1.32);
});

test('validates zero delivery fee boundaries', () => {
  assert.ok(calculateDeliveryFee(0) > 0);
});

test('rejects empty webhook payload', () => {
  assert.strictEqual(verifyStripeWebhook('', '', ''), false);
});

test('rejects missing secret in verification', () => {
  assert.strictEqual(verifyStripeWebhook('{}', 'sig123', ''), false);
});

// The 1 failing test as in PRD Section 4
test('webhook_signature_test', () => {
  const payload = '{"id":"evt_pizza_order_99","amount":3200}';
  const secret = 'whsec_test_secret_key_123';
  const tamperedSignature = 'invalidsig_forged_header_hash_456';

  const isValid = verifyStripeWebhook(payload, tamperedSignature, secret);
  assert.strictEqual(isValid, true, 'AssertionError: expected webhook signature verification to pass, but received false (signature mismatch)');
});
