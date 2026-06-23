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
        <Link href="/" className="hover:text-foreground">
          首頁
        </Link>
        {product.categories && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/categories/${product.categories.slug}`}
              className="hover:text-foreground"
            >
              {product.categories.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-neutral-50">
            {images[0] ? (
              <Image
                src={images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
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
                  className="relative aspect-square overflow-hidden rounded-lg border border-border bg-neutral-50"
                >
                  <Image
                    src={url}
                    alt={product.name}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.is_new && (
            <span className="inline-block rounded bg-accent px-2 py-0.5 text-xs font-medium text-white">
              新品
            </span>
          )}
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{product.name}</h1>
          <div className="mt-2 space-y-1 text-sm text-muted">
            <p>品牌 {product.brand}</p>
            {product.model_number && <p>型號 {product.model_number}</p>}
            {product.sku && <p>SKU {product.sku}</p>}
          </div>
          <p className="mt-6 text-2xl font-semibold">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <div className="mt-6 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {product.description}
            </div>
          )}

          {specEntries.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold">商品規格</h2>
              <dl className="divide-y divide-border rounded-lg border border-border">
                {specEntries.map(([key, value]) => (
                  <div key={key} className="flex px-4 py-2.5 text-sm">
                    <dt className="w-28 shrink-0 text-muted">{key}</dt>
                    <dd className="text-foreground">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8 rounded-lg bg-neutral-50 p-4 text-sm text-muted">
            欲詢價或訂購，請來電或加 LINE 洽詢門市人員。
          </div>
        </div>
      </div>
    </div>
  );
}
