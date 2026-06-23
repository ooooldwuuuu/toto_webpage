import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/supabase/types";

export function ProductGrid({
  products,
  empty = "目前沒有商品。",
}: {
  products: Product[];
  empty?: string;
}) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted">{empty}</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
