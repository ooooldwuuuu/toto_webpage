/**
 * TEMPORARY back-office auth bypass.
 *
 * While `true`, the /admin area is viewable WITHOUT logging in so the UI can be
 * previewed on the deployed site. To keep that open preview safe:
 *   - the proxy skips its "unauthenticated → /admin/login" redirect
 *     (and bounces /admin/login back to /admin),
 *   - the admin layout renders its chrome without a Supabase session, and
 *   - every write action (create / update / delete) is disabled, so the
 *     preview cannot mutate the database or storage.
 *
 * Set back to `false` to restore normal Supabase email/password auth.
 * Touch points: src/lib/supabase/proxy.ts, src/app/admin/layout.tsx,
 * src/app/admin/actions.ts.
 */
export const ADMIN_AUTH_DISABLED: boolean = true;
