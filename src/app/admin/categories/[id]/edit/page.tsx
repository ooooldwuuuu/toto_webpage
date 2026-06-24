import { notFound } from "next/navigation";

import { updateCategory } from "@/app/admin/actions";
import { CategoryForm } from "@/app/admin/categories/category-form";
import { mockCategories } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/supabase/types";

export const metadata = { title: "編輯分類" };

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let category: Category | null;
  if (!isSupabaseConfigured) {
    category = mockCategories.find((c) => c.id === id) ?? null;
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    category = (data as Category) ?? null;
  }

  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">編輯分類</h1>
      <CategoryForm action={updateCategory} category={category} />
    </div>
  );
}
