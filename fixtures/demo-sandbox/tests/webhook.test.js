import test from 'node:test';
import assert from 'node:assert';
import { processCheckout } from '../src/checkout.js';

test('calculates total for single item', () => {
  const result = processCheckout({ items: [{ price: 10, quantity: 2 }] }, { id: 'u1' });
  assert.strictEqual(result.amount, 20);
});

test('fails on missing signature verification', () => {
  // Simulates failing signature test as in PRD Section 4
  const expectedSignature = 'valid_sig_abc123';
  const incomingSignature = 'tampered_payload_xyz';
  assert.strictEqual(incomingSignature, expectedSignature, 'AssertionError: webhook signature mismatch');
});
