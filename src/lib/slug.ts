/**
 * Make a URL-safe slug. Keeps CJK characters (so Chinese product names still
 * produce a usable, unique-ish slug) while stripping punctuation and spaces.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9一-鿿-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
