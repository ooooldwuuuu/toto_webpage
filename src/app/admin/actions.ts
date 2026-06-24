"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ADMIN_AUTH_DISABLED } from "@/lib/admin-auth";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/images";
import { slugify } from "@/lib/slug";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

export type ActionState = { error: string | null };

// While auth is bypassed for previewing the UI, refuse all writes so the open
// back office cannot mutate the database or storage.
const PREVIEW_READONLY: ActionState = {
  error: "預覽模式：已停用寫入操作（尚未啟用登入）。",
};

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function signIn(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/admin");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "登入失敗，請確認帳號密碼。" };

  redirect(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Product create / update / delete
// ---------------------------------------------------------------------------

function parseSpecs(raw: string): Json {
  // Accepts "key: value" per line, or raw JSON.
  const trimmed = raw.trim();
  if (!trimmed) return {};
  if (trimmed.startsWith("{")) {
    try {
      return JSON.parse(trimmed) as Json;
    } catch {
      return {};
    }
  }
  const out: Record<string, string> = {};
  for (const line of trimmed.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) out[key] = value;
  }
  return out;
}

async function uploadImages(productId: string, files: File[]): Promise<string[]> {
  const supabase = await createClient();
  const paths: string[] = [];
  for (const file of files) {
    if (!file || file.size === 0) continue;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${productId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (!error) paths.push(path);
  }
  return paths;
}

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slug =
    slugify(String(formData.get("slug") ?? "")) || slugify(name) || crypto.randomUUID();
  const priceRaw = String(formData.get("price") ?? "").trim();

  return {
    name,
    slug,
    description: String(formData.get("description") ?? "").trim() || null,
    category_id: String(formData.get("category_id") ?? "") || null,
    model_number: String(formData.get("model_number") ?? "").trim() || null,
    sku: String(formData.get("sku") ?? "").trim() || null,
    price: priceRaw ? Number(priceRaw) : null,
    specs: parseSpecs(String(formData.get("specs") ?? "")),
    is_published: formData.get("is_published") === "on",
    is_new: formData.get("is_new") === "on",
    sort_order: Number(String(formData.get("sort_order") ?? "0")) || 0,
  };
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (ADMIN_AUTH_DISABLED) return PREVIEW_READONLY;
  const fields = readProductFields(formData);
  if (!fields.name) return { error: "請輸入商品名稱。" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({ ...fields, images: [] })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "新增失敗。" };
  }

  const files = formData.getAll("images").filter((f): f is File => f instanceof File);
  const images = await uploadImages(data.id, files);
  if (images.length > 0) {
    await supabase.from("products").update({ images }).eq("id", data.id);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (ADMIN_AUTH_DISABLED) return PREVIEW_READONLY;
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "缺少商品 ID。" };
  const fields = readProductFields(formData);
  if (!fields.name) return { error: "請輸入商品名稱。" };

  const supabase = await createClient();

  // Existing images the user kept (hidden inputs) + any newly uploaded files.
  const keptImages = formData
    .getAll("existing_images")
    .map((v) => String(v))
    .filter(Boolean);
  const files = formData.getAll("images").filter((f): f is File => f instanceof File);
  const newImages = await uploadImages(id, files);

  const { error } = await supabase
    .from("products")
    .update({ ...fields, images: [...keptImages, ...newImages] })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/products/${fields.slug}`);
  redirect("/admin");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  if (ADMIN_AUTH_DISABLED) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("images")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("products").delete().eq("id", id);

  // Best-effort storage cleanup with the service role (bypasses RLS).
  if (data?.images?.length) {
    try {
      const admin = createAdminClient();
      await admin.storage.from(PRODUCT_IMAGE_BUCKET).remove(data.images);
    } catch {
      // Storage cleanup is non-critical; ignore if service key is unset.
    }
  }

  revalidatePath("/admin");
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Category create / update / delete
// ---------------------------------------------------------------------------

// The storefront treats this slug as a virtual "all new products" view, so the
// row must keep existing — guard it from deletion.
const VIRTUAL_CATEGORY_SLUG = "new-arrivals";

function readCategoryFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slug =
    slugify(String(formData.get("slug") ?? "")) ||
    slugify(name) ||
    crypto.randomUUID();
  return {
    name,
    slug,
    description: String(formData.get("description") ?? "").trim() || null,
    sort_order: Number(String(formData.get("sort_order") ?? "0")) || 0,
  };
}

function categoryError(message: string): string {
  if (/duplicate|unique/i.test(message)) return "網址代稱已存在，請換一個。";
  return message || "操作失敗。";
}

export async function createCategory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (ADMIN_AUTH_DISABLED) return PREVIEW_READONLY;
  const fields = readCategoryFields(formData);
  if (!fields.name) return { error: "請輸入分類名稱。" };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert(fields);
  if (error) return { error: categoryError(error.message) };

  revalidatePath("/admin/categories");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function updateCategory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (ADMIN_AUTH_DISABLED) return PREVIEW_READONLY;
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "缺少分類 ID。" };
  const fields = readCategoryFields(formData);
  if (!fields.name) return { error: "請輸入分類名稱。" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update(fields)
    .eq("id", id);
  if (error) return { error: categoryError(error.message) };

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath(`/categories/${fields.slug}`);
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  if (ADMIN_AUTH_DISABLED) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  // Never delete the virtual "new-arrivals" category the storefront depends on.
  const { data: category } = await supabase
    .from("categories")
    .select("slug")
    .eq("id", id)
    .maybeSingle();
  if (category?.slug === VIRTUAL_CATEGORY_SLUG) return;

  // Products reference categories with `on delete set null`, so any products in
  // this category simply become uncategorised.
  await supabase.from("categories").delete().eq("id", id);

  revalidatePath("/admin/categories");
  revalidatePath("/");
}
