import Link from "next/link";

import { signOut } from "@/app/admin/actions";
import { ADMIN_AUTH_DISABLED } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "後台管理" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Without a database the back office normally stays disabled. In preview
  // mode (ADMIN_AUTH_DISABLED) we instead render it on mock data so the UI can
  // be viewed before Supabase is wired up — matching the storefront.
  if (!isSupabaseConfigured && !ADMIN_AUTH_DISABLED) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="max-w-md rounded-xl border border-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold text-accent">後台尚未啟用</h1>
          <p className="mt-3 text-sm text-muted">
            後台需要連接 Supabase 才能運作。請先在 <code>.env.local</code> 填入
            Supabase 金鑰並執行資料庫 migration（詳見 README）。目前可先瀏覽前台靜態頁面。
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            回到前台
          </Link>
        </div>
      </div>
    );
  }

  // Resolve the session only when Supabase is configured; preview mode may run
  // on mock data with no database at all.
  let userEmail: string | null = null;
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Normally only /admin/login reaches here unauthenticated (the proxy
    // redirects every other /admin path), so render it bare with no chrome.
    // While ADMIN_AUTH_DISABLED we instead render the chrome without a session.
    if (!user && !ADMIN_AUTH_DISABLED) {
      return <>{children}</>;
    }
    userEmail = user?.email ?? null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-accent">
              TOTO<span className="text-foreground"> 後台</span>
            </Link>
            <Link href="/admin" className="text-sm text-muted hover:text-foreground">
              商品列表
            </Link>
            <Link
              href="/admin/categories"
              className="text-sm text-muted hover:text-foreground"
            >
              分類管理
            </Link>
            <Link
              href="/admin/products/new"
              className="text-sm text-muted hover:text-foreground"
            >
              新增商品
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-sm text-muted hover:text-foreground"
            >
              查看前台 ↗
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {userEmail ? (
              <>
                <span className="hidden text-sm text-muted sm:inline">
                  {userEmail}
                </span>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-neutral-50"
                  >
                    登出
                  </button>
                </form>
              </>
            ) : (
              <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
                預覽模式 · 未啟用登入
              </span>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
