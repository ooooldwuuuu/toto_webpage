import Link from "next/link";

import { deleteCategory } from "@/app/admin/actions";
import { mockProducts } from "@/lib/mock-data";
import { getCategories } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "分類管理" };

const VIRTUAL_CATEGORY_SLUG = "new-arrivals";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  // Count products per category for context before editing/deleting.
  let categoryIds: (string | null)[];
  if (!isSupabaseConfigured) {
    categoryIds = mockProducts.map((p) => p.category_id);
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("products").select("category_id");
    categoryIds = (data ?? []).map((r) => r.category_id);
  }
  const counts = new Map<string, number>();
  for (const cid of categoryIds) {
    if (cid) counts.set(cid, (counts.get(cid) ?? 0) + 1);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">分類管理</h1>
          <p className="text-sm text-muted">共 {categories.length} 個分類</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + 新增分類
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-neutral-50 text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">名稱</th>
              <th className="px-4 py-3 font-medium">網址代稱</th>
              <th className="px-4 py-3 font-medium">商品數</th>
              <th className="px-4 py-3 font-medium">排序</th>
              <th className="px-4 py-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  尚無分類，點擊「新增分類」開始建立。
                </td>
              </tr>
            )}
            {categories.map((category) => {
              const isVirtual = category.slug === VIRTUAL_CATEGORY_SLUG;
              return (
                <tr key={category.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">
                      {category.name}
                    </span>
                    {isVirtual && (
                      <span className="ml-2 rounded bg-accent-soft px-2 py-0.5 text-xs text-accent">
                        系統分類
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {category.slug}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {isVirtual ? "—" : (counts.get(category.id) ?? 0)}
                  </td>
                  <td className="px-4 py-3 text-muted">{category.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="text-accent hover:underline"
                      >
                        編輯
                      </Link>
                      {isVirtual ? (
                        <span className="text-neutral-300">刪除</span>
                      ) : (
                        <form action={deleteCategory}>
                          <input type="hidden" name="id" value={category.id} />
                          <button
                            type="submit"
                            className="text-red-600 hover:underline"
                          >
                            刪除
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
