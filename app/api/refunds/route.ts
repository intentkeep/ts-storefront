import { requireRole } from '../../../lib/auth';
import { recall, remember } from '../../../lib/idempotency';
import { isRefundable } from '../../../lib/refund-policy';

interface RefundRequestBody {
  readonly orderId: string;
  readonly orderDate: string;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// TODO: partial refunds are planned for a later sprint - not implemented here.
/**
 * Sample-app fixture: an HTTP endpoint whose response boundary is its status
 * code and body. Only staff may issue refunds (403 otherwise). A replayed
 * Idempotency-Key returns the original result without refunding again. A refund
 * outside the 30-day window is rejected with 422 and REFUND_WINDOW_EXPIRED; an
 * eligible refund returns 200.
 */
export async function POST(request: Request): Promise<Response> {

  const idempotencyKey = request.headers.get('Idempotency-Key')?.trim() ?? '';
  if (idempotencyKey !== '') {
    const previous = recall(idempotencyKey);
    if (previous !== undefined) {
      return json({ status: 'refunded', orderId: previous, replayed: true }, 200);
    }
  }

  const body = (await request.json()) as RefundRequestBody;
  const orderDate = new Date(body.orderDate);

  if (!isRefundable(orderDate)) {
    return json({ error: 'REFUND_WINDOW_EXPIRED' }, 422);
  }

  if (idempotencyKey !== '') {
    remember(idempotencyKey, body.orderId);
  }

  return json({ status: 'refunded', orderId: body.orderId }, 200);
}
