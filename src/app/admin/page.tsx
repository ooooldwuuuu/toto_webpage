import Link from "next/link";

import { deleteProduct } from "@/app/admin/actions";
import { formatPrice, productImageUrl } from "@/lib/images";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { ProductWithCategory } from "@/lib/supabase/types";

export default async function AdminProductsPage() {
  let products: ProductWithCategory[];

  if (!isSupabaseConfigured) {
    // Mock-data preview (no database) — mirror the storefront fallback.
    products = mockProducts.map((p) => ({
      ...p,
      categories: mockCategories.find((c) => c.id === p.category_id) ?? null,
    }));
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    products = (data ?? []) as ProductWithCategory[];
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">商品列表</h1>
          <p className="text-sm text-muted">共 {products.length} 件商品</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + 新增商品
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-neutral-50 text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">商品</th>
              <th className="px-4 py-3 font-medium">分類</th>
              <th className="px-4 py-3 font-medium">價格</th>
              <th className="px-4 py-3 font-medium">狀態</th>
              <th className="px-4 py-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  尚無商品，點擊「新增商品」開始建立。
                </td>
              </tr>
            )}
            {products.map((product) => {
              const thumb = productImageUrl(product.images[0]);
              return (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded border border-border bg-neutral-100">
                        {thumb && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumb}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {product.name}
                        </div>
                        <div className="text-xs text-muted">
                          {product.model_number ?? product.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {product.categories?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    {product.is_published ? (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                        已上架
                      </span>
                    ) : (
                      <span className="rounded bg-neutral-200 px-2 py-0.5 text-xs text-neutral-600">
                        草稿
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-accent hover:underline"
                      >
                        編輯
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <button
                          type="submit"
                          className="text-red-600 hover:underline"
                        >
                          刪除
                        </button>
                      </form>
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
