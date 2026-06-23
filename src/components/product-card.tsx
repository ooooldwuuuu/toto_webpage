import Image from "next/image";
import Link from "next/link";

import { formatPrice, productImageUrl } from "@/lib/images";
import type { Product } from "@/lib/supabase/types";

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = productImageUrl(product.images[0]);

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-neutral-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            無圖片
          </div>
        )}
        {product.is_new && (
          <span className="absolute left-2 top-2 rounded bg-accent px-2 py-0.5 text-xs font-medium text-white">
            新品
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">
          {product.name}
        </h3>
        {product.model_number && (
          <p className="text-xs text-muted">型號 {product.model_number}</p>
        )}
        <p className="text-sm font-semibold text-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
