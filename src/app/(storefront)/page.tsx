import { CategoryStrip } from "@/components/category-strip";
import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";
import { getCategories, getPublishedProducts } from "@/lib/queries";

export default async function HomePage() {
  const [products, categories, newProducts] = await Promise.all([
    getPublishedProducts({ limit: 12 }),
    getCategories(),
    getPublishedProducts({ newOnly: true, limit: 8 }),
  ]);

  const featured = newProducts[0] ?? products[0] ?? null;
  const grid = products.filter((p) => p.id !== featured?.id);

  return (
    <>
      <Hero featured={featured} />

      <div className="border-y border-border bg-surface/60">
        <CategoryStrip categories={categories} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            精選商品
          </h2>
        </div>
        <ProductGrid products={grid} empty="尚未上架商品。請從後台新增商品。" />
      </section>
    </>
  );
}
