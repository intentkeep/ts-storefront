import { requireRole } from '../../../../../lib/auth';
import { canTransition, type OrderState } from '../../../../../lib/order-state';
import { getOrder } from '../../../../../lib/repository';

interface TransitionBody {
  readonly to: OrderState;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Sample-app fixture: a state-machine endpoint. Only staff may move an order
 * (403 otherwise). An unknown order is 404. A move that is not allowed by the
 * lifecycle is rejected with 409 and ILLEGAL_TRANSITION; a legal move returns
 * 200 with the new state.
 */
export async function POST(
  request: Request,
  context: { readonly params: { readonly id: string } }
): Promise<Response> {
  if (!requireRole(request, 'staff')) {
    return json({ error: 'FORBIDDEN' }, 403);
  }

  const order = getOrder(context.params.id);
  if (order === undefined) {
    return json({ error: 'ORDER_NOT_FOUND' }, 404);
  }

  const body = (await request.json()) as TransitionBody;
  if (!canTransition(order.state, body.to)) {
    return json({ error: 'ILLEGAL_TRANSITION' }, 409);
  }

  return json({ id: order.id, state: body.to }, 200);
}
