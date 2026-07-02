import { priceCheckout, type PricingInput } from '../../../lib/pricing';

interface CheckoutBody {
  readonly quantity: number;
  readonly unitPrice: number;
  readonly taxRate: number;
  readonly discount?: PricingInput['discount'];
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Sample-app fixture: a checkout endpoint with validation precedence. Quantity
 * is validated before any pricing runs - a non-positive quantity is rejected
 * with 400 and INVALID_QUANTITY, never priced. Otherwise the discount and tax
 * are applied and the total is returned with 200.
 */
export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as CheckoutBody;

  if (body.quantity <= 0) {
    return json({ error: 'INVALID_QUANTITY' }, 400);
  }

  const total = priceCheckout({
    quantity: body.quantity,
    unitPrice: body.unitPrice,
    taxRate: body.taxRate,
    discount: body.discount,
  });

  return json({ total }, 200);
}
