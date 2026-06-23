import {
  mockCategories,
  mockProducts,
  mockProductWithCategory,
} from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product, ProductWithCategory } from "@/lib/supabase/types";

/**
 * Read-side data access for the public storefront. RLS already hides
 * unpublished products from the anon key, but we filter explicitly too so the
 * intent is clear and admin sessions don't accidentally leak drafts.
 *
 * Until Supabase is wired up (`isSupabaseConfigured === false`), every query
 * returns built-in mock data so the static site can be developed standalone.
 */

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return mockCategories;

  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isSupabaseConfigured) {
    return mockCategories.find((c) => c.slug === slug) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getPublishedProducts(options?: {
  categoryId?: string;
  newOnly?: boolean;
  limit?: number;
}): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    let items = mockProducts.filter((p) => p.is_published);
    if (options?.categoryId) {
      items = items.filter((p) => p.category_id === options.categoryId);
    }
    if (options?.newOnly) items = items.filter((p) => p.is_new);
    if (options?.limit) items = items.slice(0, options.limit);
    return items;
  }

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (options?.categoryId) query = query.eq("category_id", options.categoryId);
  if (options?.newOnly) query = query.eq("is_new", true);
  if (options?.limit) query = query.limit(options.limit);

  const { data } = await query;
  return data ?? [];
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithCategory | null> {
  if (!isSupabaseConfigured) return mockProductWithCategory(slug);

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data as ProductWithCategory | null;
}
