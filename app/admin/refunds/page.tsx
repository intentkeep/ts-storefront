import { hasRole, type Role } from '../../../lib/auth';

/**
 * Sample-app fixture: an admin-only page. The refund queue is shown only when
 * the viewer is an admin; everyone else sees a no-access message. The gate is
 * an imported helper, so the authorization requirement lives outside this file.
 */
export default function AdminRefundsPage({ role }: { readonly role: Role }) {
  if (!hasRole(role, 'admin')) {
    return (
      <main>
        <p>You do not have access to the refund queue.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Refund queue</h1>
      <ul>
        <li>Pending refund review</li>
      </ul>
    </main>
  );
}
