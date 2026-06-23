import Image from "next/image";
import Link from "next/link";

import { formatPrice, productImageUrl } from "@/lib/images";
import type { Product } from "@/lib/supabase/types";

/**
 * Asymmetric split hero. Left column carries the brand statement and primary
 * actions; the right column spotlights the newest real product (image + price)
 * rather than decorative stock photography.
 */
export function Hero({ featured }: { featured?: Product | null }) {
  const imageUrl = featured ? productImageUrl(featured.images[0]) : null;

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20 lg:px-8">
      <div className="animate-rise">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          TOTO 衛浴 · 智慧潔淨
        </p>
        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          為日常浴室，
          <br />
          注入日本工藝
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
          精選馬桶、免治便座、面盆與龍頭，將潔淨科技與簡約設計帶入每一個家。
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/categories/new-arrivals"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-hover active:translate-y-px"
          >
            瀏覽新品上市
          </Link>
          <Link
            href="#categories"
            className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent active:translate-y-px"
          >
            探索全部分類
          </Link>
        </div>
      </div>

      <div
        className="animate-rise"
        style={{ animationDelay: "0.1s" }}
      >
        {featured ? (
          <Link
            href={`/products/${featured.slug}`}
            className="group block overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_60px_-32px_rgba(0,84,166,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(0,84,166,0.45)]"
          >
            <div className="relative aspect-[4/3] bg-accent-soft">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={featured.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-contain p-10 transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted">
                  無圖片
                </div>
              )}
              {featured.is_new && (
                <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                  新品上市
                </span>
              )}
            </div>
            <div className="flex items-end justify-between gap-4 border-t border-border px-6 py-5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {featured.name}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {formatPrice(featured.price)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-accent transition-colors group-hover:text-accent-hover">
                查看商品 →
              </span>
            </div>
          </Link>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-accent-soft text-2xl font-bold tracking-tight text-accent">
            TOTO 衛浴
          </div>
        )}
      </div>
    </section>
  );
}
