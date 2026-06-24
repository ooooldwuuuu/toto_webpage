import { createProduct } from "@/app/admin/actions";
import { ProductForm } from "@/app/admin/products/product-form";
import { getCategories } from "@/lib/queries";

export const metadata = { title: "新增商品" };

export default async function NewProductPage() {
  // getCategories() returns mock data when Supabase is not configured.
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">新增商品</h1>
      <ProductForm action={createProduct} categories={categories} />
    </div>
  );
}
