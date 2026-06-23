export const PRODUCT_IMAGE_BUCKET = "product-images";

/**
 * Build the public URL for a product image stored in Supabase Storage.
 * Images are stored as object paths (e.g. "<productId>/<file>.jpg"); the
 * bucket is public so the URL is deterministic and needs no client call.
 * Pass-through for values that are already absolute URLs.
 */
export function productImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Local asset in /public (used by dev mock data).
  if (path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/${path}`;
}

const TWD = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "價格請洽詢";
  return TWD.format(price);
}
