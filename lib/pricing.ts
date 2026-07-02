/**
 * Sample-app fixture: checkout pricing. Observable behaviour is the final
 * total: an expired discount is ignored, a live discount is applied, then tax
 * is added and the result is rounded half-to-even. The rounding rule is the
 * kind of detail a model must compute, not fabricate.
 */
export interface DiscountInput {
  readonly percentage: number;
  readonly expiresAt: string;
}

export interface PricingInput {
  readonly quantity: number;
  readonly unitPrice: number;
  readonly taxRate: number;
  readonly discount?: DiscountInput;
}

function roundHalfToEven(value: number): number {
  const scaled = value * 100;
  const floor = Math.floor(scaled);
  const diff = scaled - floor;

  let rounded: number;
  if (diff > 0.5) {
    rounded = floor + 1;
  } else if (diff < 0.5) {
    rounded = floor;
  } else {
    rounded = floor % 2 === 0 ? floor : floor + 1;
  }

  return rounded / 100;
}

function discountIsLive(discount: DiscountInput, now: number): boolean {
  return new Date(discount.expiresAt).getTime() >= now;
}

export function priceCheckout(input: PricingInput, now: number = Date.now()): number {
  const subtotal = input.quantity * input.unitPrice;

  const discounted =
    input.discount !== undefined && discountIsLive(input.discount, now)
      ? subtotal * (1 - input.discount.percentage / 100)
      : subtotal;

  const taxed = discounted * (1 + input.taxRate);
  return roundHalfToEven(taxed);
}
