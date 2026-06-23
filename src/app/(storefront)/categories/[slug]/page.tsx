import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/product-grid";
import {
  getCategoryBySlug,
  getPublishedProducts,
} from "@/lib/queries";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "商品分類" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  // The "new-arrivals" category is a curated view of every new product,
  // not products literally assigned to that category.
  const products =
    slug === "new-arrivals"
      ? await getPublishedProducts({ newOnly: true })
      : await getPublishedProducts({ categoryId: category.id });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-accent">
          首頁
        </Link>
        <span className="mx-2 text-border">/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>
      <header className="mb-9 border-b border-border pb-7">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            {category.description}
          </p>
        )}
        <p className="mt-4 text-sm text-muted">共 {products.length} 件商品</p>
      </header>
      <ProductGrid products={products} empty="此分類目前沒有商品。" />
    </div>
  );
}
