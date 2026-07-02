/**
 * Sample-app fixture: the order lifecycle as a state machine. The real
 * requirement is the transition graph - which moves are legal and which are
 * rejected - not any single function. A model has to enumerate the table to
 * cover every branch.
 */
export type OrderState =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

const ALLOWED_TRANSITIONS: Record<OrderState, readonly OrderState[]> = {
  pending: ['paid', 'cancelled'],
  paid: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
};

export function canTransition(from: OrderState, to: OrderState): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}
