import Link from "next/link";

import type { Category } from "@/lib/supabase/types";

/**
 * Category navigation grid: the storefront's primary "browse by category"
 * entry point. The virtual "new-arrivals" category is surfaced in the hero CTA
 * instead, so it is filtered out here to avoid a duplicate path.
 */
export function CategoryStrip({ categories }: { categories: Category[] }) {
  const items = categories.filter((c) => c.slug !== "new-arrivals");
  if (items.length === 0) return null;

  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        依分類選購
      </h2>
      <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[0_18px_40px_-28px_rgba(0,84,166,0.4)]"
          >
            <div>
              <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
                  {category.description}
                </p>
              )}
            </div>
            <span className="mt-6 text-sm font-semibold text-accent">
              查看 →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
