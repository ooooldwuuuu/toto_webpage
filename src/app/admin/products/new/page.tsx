import { createProduct } from "@/app/admin/actions";
import { ProductForm } from "@/app/admin/products/product-form";
import { getCategories } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "新增商品" };

export default async function NewProductPage() {
  if (!isSupabaseConfigured) return null;

  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">新增商品</h1>
      <ProductForm action={createProduct} categories={categories} />
    </div>
  );
}
