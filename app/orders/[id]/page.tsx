import { isRefundable } from '../../../lib/refund-policy';
import { getOrder } from '../../../lib/repository';

/**
 * Sample-app fixture: a page whose visible actions depend on the order's state.
 * A pending order can be cancelled; a shipped order can be tracked; a delivered
 * order shows Request refund only while inside the 30-day window, and otherwise
 * an explanatory message. An unknown order shows a not-found message.
 */
export default function OrderDetailPage({
  params,
}: {
  readonly params: { readonly id: string };
}) {
  const order = getOrder(params.id);

  if (order === undefined) {
    return (
      <main>
        <p>We could not find that order.</p>
      </main>
    );
  }

  const refundable =
    order.state === 'delivered' && isRefundable(new Date(order.placedAt));

  return (
    <main>
      <h1>Order {order.id}</h1>
      {order.state === 'pending' ? <button type="button">Cancel order</button> : null}
      {order.state === 'shipped' ? <button type="button">Track shipment</button> : null}
      {refundable ? <button type="button">Request refund</button> : null}
      {order.state === 'delivered' && !refundable ? (
        <p>This order is outside the 30-day refund window.</p>
      ) : null}
    </main>
  );
}
