"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import type { ActionState } from "@/app/admin/actions";
import { productImageUrl } from "@/lib/images";
import type { Category, Product } from "@/lib/supabase/types";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

const initialState: ActionState = { error: null };

function specsToText(specs: Product["specs"] | undefined): string {
  if (!specs || typeof specs !== "object") return "";
  return Object.entries(specs as Record<string, unknown>)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

export function ProductForm({
  action,
  categories,
  product,
}: {
  action: Action;
  categories: Category[];
  product?: Product;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [keptImages, setKeptImages] = useState<string[]>(product?.images ?? []);

  const field =
    "mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent";
  const label = "block text-sm font-medium";

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      {keptImages.map((path) => (
        <input key={path} type="hidden" name="existing_images" value={path} />
      ))}

      <div>
        <label htmlFor="name" className={label}>
          商品名稱 *
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={product?.name}
          className={field}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className={label}>
            網址代稱 (slug)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={product?.slug}
            placeholder="留空將自動產生"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="category_id" className={label}>
            分類
          </label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className={field}
          >
            <option value="">未分類</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="model_number" className={label}>
            型號
          </label>
          <input
            id="model_number"
            name="model_number"
            defaultValue={product?.model_number ?? ""}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="sku" className={label}>
            SKU
          </label>
          <input
            id="sku"
            name="sku"
            defaultValue={product?.sku ?? ""}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="price" className={label}>
            價格 (TWD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            defaultValue={product?.price ?? ""}
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={label}>
          商品描述
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={product?.description ?? ""}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="specs" className={label}>
          商品規格
        </label>
        <textarea
          id="specs"
          name="specs"
          rows={5}
          defaultValue={specsToText(product?.specs)}
          placeholder={"每行一項，格式「名稱: 內容」，例如\n尺寸: 700×400×500 mm\n材質: 陶瓷"}
          className={`${field} font-mono`}
        />
      </div>

      {keptImages.length > 0 && (
        <div>
          <span className={label}>目前圖片</span>
          <div className="mt-2 flex flex-wrap gap-3">
            {keptImages.map((path) => (
              <div key={path} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={productImageUrl(path) ?? ""}
                  alt=""
                  className="h-20 w-20 rounded border border-border object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setKeptImages((imgs) => imgs.filter((p) => p !== path))
                  }
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                  aria-label="移除圖片"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="images" className={label}>
          {product ? "新增圖片" : "商品圖片"}
        </label>
        <input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          className="mt-1 block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
        <p className="mt-1 text-xs text-muted">可一次選擇多張，第一張為主圖。</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 sm:items-center">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={product ? product.is_published : false}
          />
          上架（公開顯示）
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_new"
            defaultChecked={product ? product.is_new : true}
          />
          標示為新品
        </label>
        <div>
          <label htmlFor="sort_order" className={label}>
            排序
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={product?.sort_order ?? 0}
            className={field}
          />
        </div>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "儲存中…" : product ? "更新商品" : "建立商品"}
        </button>
        <Link
          href="/admin"
          className="rounded-md border border-border px-5 py-2 text-sm hover:bg-neutral-50"
        >
          取消
        </Link>
      </div>
    </form>
  );
}
