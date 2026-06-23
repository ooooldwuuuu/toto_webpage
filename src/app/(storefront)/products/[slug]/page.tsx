import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatPrice, productImageUrl } from "@/lib/images";
import { getProductBySlug } from "@/lib/queries";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.name ?? "商品",
    description: product?.description ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = product.images
    .map((path) => productImageUrl(path))
    .filter((url): url is string => Boolean(url));
  const specs = (product.specs ?? {}) as Record<string, unknown>;
  const specEntries = Object.entries(specs).filter(
    ([, value]) => value != null && value !== "",
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-accent">
          首頁
        </Link>
        {product.categories && (
          <>
            <span className="mx-2 text-border">/</span>
            <Link
              href={`/categories/${product.categories.slug}`}
              className="transition-colors hover:text-accent"
            >
              {product.categories.name}
            </Link>
          </>
        )}
        <span className="mx-2 text-border">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface-muted">
            {images[0] ? (
              <Image
                src={images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-8"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted">
                無圖片
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1).map((url) => (
                <div
                  key={url}
                  className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface-muted"
                >
                  <Image
                    src={url}
                    alt={product.name}
                    fill
                    sizes="20vw"
                    className="object-contain p-3"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.is_new && (
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
              新品上市
            </span>
          )}
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            <span>品牌 {product.brand}</span>
            {product.model_number && <span>型號 {product.model_number}</span>}
            {product.sku && <span>SKU {product.sku}</span>}
          </div>
          <p className="mt-6 text-3xl font-bold text-accent">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <div className="mt-6 whitespace-pre-line text-base leading-relaxed text-foreground/90">
              {product.description}
            </div>
          )}

          {specEntries.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
                商品規格
              </h2>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {specEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl border border-border bg-surface px-4 py-3"
                  >
                    <dt className="text-xs text-muted">{key}</dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-accent/20 bg-accent-soft p-5">
            <p className="text-sm font-semibold text-accent">詢價與訂購</p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
              欲詢價或訂購，請來電或加 LINE 洽詢門市人員，我們將為您提供安裝與報價建議。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
