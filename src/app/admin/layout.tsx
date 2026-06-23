import Link from "next/link";

import { signOut } from "@/app/admin/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "後台管理" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Back office needs a real database; it stays disabled until Supabase is set.
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="max-w-md rounded-xl border border-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold text-accent">後台尚未啟用</h1>
          <p className="mt-3 text-sm text-muted">
            後台需要連接 Supabase 才能運作。請先在 <code>.env.local</code> 填入
            Supabase 金鑰並執行資料庫 migration（詳見 README）。目前可先瀏覽前台靜態頁面。
          </p>
          <a
            href="/"
            className="mt-5 inline-block rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            回到前台
          </a>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unauthenticated requests only reach here on /admin/login (the proxy
  // redirects every other /admin path). Render the page bare, no chrome.
  if (!user) {
    return <>{children}</>;
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
            <span className="hidden text-sm text-muted sm:inline">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-neutral-50"
              >
                登出
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
