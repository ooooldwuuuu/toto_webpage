import { notFound } from "next/navigation";

import { updateProduct } from "@/app/admin/actions";
import { ProductForm } from "@/app/admin/products/product-form";
import { mockProducts } from "@/lib/mock-data";
import { getCategories } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/supabase/types";

export const metadata = { title: "編輯商品" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categories = await getCategories();

  let product: Product | null;
  if (!isSupabaseConfigured) {
    // Mock-data preview (no database).
    product = mockProducts.find((p) => p.id === id) ?? null;
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    product = (data as Product) ?? null;
  }

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">編輯商品</h1>
      <ProductForm
        action={updateProduct}
        categories={categories}
        product={product}
      />
    </div>
  );
}
