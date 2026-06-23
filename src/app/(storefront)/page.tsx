import Link from "next/link";

import { ProductGrid } from "@/components/product-grid";
import { getPublishedProducts } from "@/lib/queries";

export default async function HomePage() {
  const products = await getPublishedProducts({ limit: 24 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-12 rounded-2xl bg-accent px-6 py-16 text-white sm:px-12">
        <p className="text-sm font-medium uppercase tracking-widest text-white/70">
          New Arrivals
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">新品上市</h1>
        <p className="mt-4 max-w-xl text-white/80">
          探索 TOTO 最新引進的智慧衛浴商品，從全自動馬桶到精緻面盆龍頭。
        </p>
        <Link
          href="/categories/new-arrivals"
          className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-white/90"
        >
          查看全部新品
        </Link>
      </section>

      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">精選商品</h2>
      </div>
      <ProductGrid products={products} empty="尚未上架商品。請從後台新增商品。" />
    </div>
  );
}
