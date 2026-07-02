/**
 * Sample-app fixture: a minimal idempotency store. The requirement it encodes
 * is observable across a *sequence* of requests - a replayed key must return
 * the original result instead of repeating the side effect - which single-call
 * reasoning tends to miss.
 */
const STORE = new Map<string, string>();

export function recall(key: string): string | undefined {
  return STORE.get(key);
}

export function remember(key: string, result: string): void {
  STORE.set(key, result);
}
