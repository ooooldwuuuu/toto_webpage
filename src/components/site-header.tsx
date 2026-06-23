import Link from "next/link";

import { getCategories } from "@/lib/queries";

export async function SiteHeader() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-accent">
          TOTO<span className="text-foreground"> 衛浴</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-6 overflow-x-auto md:flex">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="whitespace-nowrap text-sm text-muted transition-colors hover:text-foreground"
            >
              {category.name}
            </Link>
          ))}
        </nav>
        <Link
          href="/admin"
          className="ml-auto text-sm text-muted transition-colors hover:text-foreground md:ml-0"
        >
          後台
        </Link>
      </div>
    </header>
  );
}
