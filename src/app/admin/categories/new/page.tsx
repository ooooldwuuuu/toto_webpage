import { createCategory } from "@/app/admin/actions";
import { CategoryForm } from "@/app/admin/categories/category-form";

export const metadata = { title: "新增分類" };

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">新增分類</h1>
      <CategoryForm action={createCategory} />
    </div>
  );
}
