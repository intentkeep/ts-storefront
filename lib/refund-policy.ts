/**
 * Sample-app fixture: refund eligibility with a typed result and configurable window.
 * The codebase-analysis pipeline should describe the boundary as input -> boolean outcome.
 */
export type RefundEligibility =
  | { readonly eligible: true; readonly daysRemaining: number }
  | { readonly eligible: false; readonly reason: 'window_expired' | 'invalid_order' };

export interface RefundPolicyConfig {
  readonly windowDays: number;
}

const DEFAULT_POLICY: RefundPolicyConfig = { windowDays: 30 };

export function evaluateRefundEligibility(
  orderDate: Date,
  config: RefundPolicyConfig = DEFAULT_POLICY,
  now: Date = new Date()
): RefundEligibility {
  const ageMs = now.getTime() - orderDate.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  if (ageDays > config.windowDays) {
    return { eligible: false, reason: 'window_expired' };
  }

  return {
    eligible: true,
    daysRemaining: Math.max(0, Math.ceil(config.windowDays - ageDays)),
  };
}

/** @deprecated Use evaluateRefundEligibility for typed outcomes. */
export function isRefundable(orderDate: Date, now: Date = new Date()): boolean {
  return evaluateRefundEligibility(orderDate, DEFAULT_POLICY, now).eligible;
}

