import { isRefundable } from '../../lib/refund-policy';

interface Order {
  readonly id: string;
  readonly placedAt: string;
}

/**
 * Sample-app fixture: a page whose response boundary is what the user sees. The
 * Request refund button is shown only while the order is within the refund
 * window; otherwise an explanatory message appears instead.
 */
export default function OrdersPage({ order }: { readonly order: Order }) {
  const refundable = isRefundable(new Date(order.placedAt));

  return (
    <main>
      <h1>Order {order.id}</h1>
      {refundable ? (
        <button type="button">Request refund</button>
      ) : (
        <p>This order is outside the 30-day refund window.</p>
      )}
    </main>
  );
}
