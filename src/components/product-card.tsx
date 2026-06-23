import Image from "next/image";
import Link from "next/link";

import { formatPrice, productImageUrl } from "@/lib/images";
import type { Product } from "@/lib/supabase/types";

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = productImageUrl(product.images[0]);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_22px_50px_-30px_rgba(0,84,166,0.4)]"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            無圖片
          </div>
        )}
        {product.is_new && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-white">
            新品
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t border-border p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
          {product.name}
        </h3>
        {product.model_number && (
          <p className="text-xs text-muted">型號 {product.model_number}</p>
        )}
        <p className="mt-auto pt-2 text-sm font-semibold text-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
