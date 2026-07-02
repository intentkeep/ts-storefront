/**
 * Sample-app fixture: webhook signature verification. The security branch
 * ("reject unsigned/forged callers") is a real requirement that models often
 * omit in favour of the happy path.
 */
const EXPECTED_SIGNATURE = 'sha256=fixture';

export function verifySignature(request: Request): boolean {
  return request.headers.get('x-signature') === EXPECTED_SIGNATURE;
}
