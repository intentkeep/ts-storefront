import type { OrderState } from './order-state';

/**
 * Sample-app fixture: a fake in-memory store. Pure indirection so a surface's
 * observable behaviour ("order not found -> 404") is reached through a lookup
 * rather than inline, forcing dependency-graph traversal during analysis.
 */
export interface Order {
  readonly id: string;
  readonly state: OrderState;
  readonly placedAt: string;
}

const ORDERS: ReadonlyMap<string, Order> = new Map<string, Order>([
  ['O-1', { id: 'O-1', state: 'pending', placedAt: '2026-06-01T00:00:00.000Z' }],
  ['O-2', { id: 'O-2', state: 'shipped', placedAt: '2026-06-10T00:00:00.000Z' }],
  ['O-3', { id: 'O-3', state: 'delivered', placedAt: '2026-06-20T00:00:00.000Z' }],
]);

export function getOrder(id: string): Order | undefined {
  return ORDERS.get(id);
}
