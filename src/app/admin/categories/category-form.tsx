"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { ActionState } from "@/app/admin/actions";
import type { Category } from "@/lib/supabase/types";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

const initialState: ActionState = { error: null };

const VIRTUAL_CATEGORY_SLUG = "new-arrivals";

export function CategoryForm({
  action,
  category,
}: {
  action: Action;
  category?: Category;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isVirtual = category?.slug === VIRTUAL_CATEGORY_SLUG;

  const field =
    "mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent";
  const label = "block text-sm font-medium";

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {category && <input type="hidden" name="id" value={category.id} />}

      <div>
        <label htmlFor="name" className={label}>
          分類名稱 *
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={category?.name}
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
            defaultValue={category?.slug}
            placeholder="留空將自動產生"
            readOnly={isVirtual}
            className={`${field} ${isVirtual ? "bg-neutral-100 text-muted" : ""}`}
          />
          {isVirtual && (
            <p className="mt-1 text-xs text-muted">
              此為系統分類（新品上市），網址代稱不可變更。
            </p>
          )}
        </div>
        <div>
          <label htmlFor="sort_order" className={label}>
            排序
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={category?.sort_order ?? 0}
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={label}>
          分類描述
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={category?.description ?? ""}
          className={field}
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "儲存中…" : category ? "更新分類" : "建立分類"}
        </button>
        <Link
          href="/admin/categories"
          className="rounded-md border border-border px-5 py-2 text-sm hover:bg-neutral-50"
        >
          取消
        </Link>
      </div>
    </form>
  );
}
