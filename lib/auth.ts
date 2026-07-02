/**
 * Sample-app fixture: role-based access used by both an endpoint and a page.
 * Behaviour lives here (not in the surface files) so the codebase-analysis
 * pipeline must follow the import graph to discover the authorization rule -
 * the same "buried requirement" shape that gets dropped from noisy threads.
 */
export type Role = 'customer' | 'staff' | 'admin';

const ROLE_RANK: Record<Role, number> = {
  customer: 0,
  staff: 1,
  admin: 2,
};

function isRole(value: string): value is Role {
  return value === 'customer' || value === 'staff' || value === 'admin';
}

/** A caller satisfies a requirement when their role rank is at least as high. */
export function hasRole(actual: Role, required: Role): boolean {
  return ROLE_RANK[actual] >= ROLE_RANK[required];
}

/** Reads the caller role from the `x-role` header, defaulting to `customer`. */
export function roleFromRequest(request: Request): Role {
  const header = request.headers.get('x-role')?.trim() ?? '';
  return isRole(header) ? header : 'customer';
}

export function requireRole(request: Request, required: Role): boolean {
  return hasRole(roleFromRequest(request), required);
}
