import Link from "next/link";

import { getCategories } from "@/lib/queries";

export async function SiteFooter() {
  const categories = await getCategories();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="text-xl font-bold tracking-tight text-accent">
              TOTO<span className="font-medium text-foreground"> 衛浴</span>
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              精選 TOTO 衛浴商品成列展示。商品價格與供貨狀況請來電洽詢，門市人員將協助安裝與報價。
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {categories
              .filter((c) => c.slug !== "new-arrivals")
              .map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {category.name}
                </Link>
              ))}
          </nav>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          © {new Date().getFullYear()} TOTO 衛浴. 本站為商品展示用途。
        </div>
      </div>
    </footer>
  );
}
