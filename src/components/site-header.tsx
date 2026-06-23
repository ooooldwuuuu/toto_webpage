import Link from "next/link";

import { getCategories } from "@/lib/queries";

export async function SiteHeader() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-accent transition-opacity hover:opacity-80"
        >
          TOTO<span className="font-medium text-foreground"> 衛浴</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-7 overflow-x-auto md:flex">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="relative whitespace-nowrap text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              {category.name}
            </Link>
          ))}
        </nav>
        <Link
          href="/admin"
          className="ml-auto rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent md:ml-0"
        >
          後台管理
        </Link>
      </div>
    </header>
  );
}
