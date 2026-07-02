import { recall, remember } from '../../../../lib/idempotency';
import { verifySignature } from '../../../../lib/signature';

interface PaymentEvent {
  readonly id: string;
  readonly type: string;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Sample-app fixture: a payments webhook. An invalid signature is rejected with
 * 401 and INVALID_SIGNATURE before anything else. A duplicate event id is
 * ignored (idempotent replay). A payment.succeeded event marks the order paid;
 * payment.failed marks it failed; any other type is acknowledged but ignored.
 */
export async function POST(request: Request): Promise<Response> {
  if (!verifySignature(request)) {
    return json({ error: 'INVALID_SIGNATURE' }, 401);
  }

  const event = (await request.json()) as PaymentEvent;

  if (recall(event.id) !== undefined) {
    return json({ status: 'ignored', reason: 'duplicate' }, 200);
  }
  remember(event.id, event.type);

  if (event.type === 'payment.succeeded') {
    return json({ status: 'paid' }, 200);
  }
  if (event.type === 'payment.failed') {
    return json({ status: 'failed' }, 200);
  }

  return json({ status: 'ignored', reason: 'unhandled_type' }, 202);
}
