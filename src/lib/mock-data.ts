import type { Category, Product, ProductWithCategory } from "@/lib/supabase/types";

/**
 * Built-in sample data used by the storefront while Supabase is not yet wired
 * (see `isSupabaseConfigured`). Mirrors `supabase/seed.sql` so the local site
 * looks the same before and after the database is connected. Delete-safe once
 * real data is in place — nothing in production references this.
 */

const now = "2026-06-01T00:00:00.000Z";

export const mockCategories: Category[] = [
  { id: "cat-new", slug: "new-arrivals", name: "新品上市", description: "最新引進的 TOTO 衛浴商品", sort_order: 0, created_at: now },
  { id: "cat-toilets", slug: "toilets", name: "馬桶", description: "單體式 / 分離式智慧馬桶與免治馬桶", sort_order: 1, created_at: now },
  { id: "cat-washlets", slug: "washlets", name: "免治馬桶座", description: "WASHLET 溫水洗淨便座", sort_order: 2, created_at: now },
  { id: "cat-faucets", slug: "faucets", name: "面盆龍頭", description: "臉盆與廚房龍頭", sort_order: 3, created_at: now },
  { id: "cat-basins", slug: "basins", name: "面盆", description: "檯面盆與壁掛面盆", sort_order: 4, created_at: now },
  { id: "cat-showers", slug: "showers", name: "淋浴龍頭", description: "淋浴柱與花灑系統", sort_order: 5, created_at: now },
  { id: "cat-bathtubs", slug: "bathtubs", name: "浴缸", description: "獨立式與嵌入式浴缸", sort_order: 6, created_at: now },
];

function product(p: Partial<Product> & Pick<Product, "slug" | "name" | "category_id">): Product {
  return {
    id: p.slug,
    description: null,
    brand: "TOTO",
    model_number: null,
    sku: null,
    price: null,
    images: [],
    specs: {},
    is_published: true,
    is_new: true,
    sort_order: 0,
    created_at: now,
    updated_at: now,
    ...p,
  };
}

export const mockProducts: Product[] = [
  product({
    slug: "neorest-nx2",
    name: "NEOREST NX2 智慧型全自動馬桶",
    description: "頂級一體成型智慧馬桶，搭載 EWATER+ 除菌與自動掀蓋，CEFIONTECT 奈米級釉面易清潔。",
    category_id: "cat-toilets",
    model_number: "CS989VX",
    price: 268000,
    images: ["/placeholders/toilet.svg"],
    specs: { 尺寸: "700×440×540 mm", 沖水量: "3.8L / 4.8L", 釉面: "CEFIONTECT", 功能: "自動掀蓋・除菌・暖座" },
    sort_order: 0,
  }),
  product({
    slug: "washlet-sw",
    name: "WASHLET SW 溫水洗淨便座",
    description: "溫水洗淨、暖座與除臭一體式便座，操作簡單，適用多數既有馬桶。",
    category_id: "cat-washlets",
    model_number: "TCF6631",
    price: 19800,
    images: ["/placeholders/washlet.svg"],
    specs: { 洗淨模式: "後部・婦洗・柔洗", 暖座: "5 段溫控", 除臭: "內建" },
    sort_order: 1,
  }),
  product({
    slug: "gc-faucet",
    name: "GC 系列單孔面盆龍頭",
    description: "簡約方形設計單把手面盆龍頭，附節水起泡器。",
    category_id: "cat-faucets",
    model_number: "TLG10301",
    price: 8900,
    images: ["/placeholders/faucet.svg"],
    specs: { 材質: "黃銅鍍鉻", 出水: "節水起泡", 安裝: "單孔" },
    sort_order: 2,
  }),
  product({
    slug: "le-muse-basin",
    name: "LE MUSE 檯面式面盆",
    description: "日本製陶瓷檯面盆，CEFIONTECT 奈米級釉面，不易卡污。",
    category_id: "cat-basins",
    model_number: "LW1714B",
    price: 15600,
    images: ["/placeholders/basin.svg"],
    specs: { 尺寸: "530×430×150 mm", 材質: "陶瓷", 釉面: "CEFIONTECT" },
    sort_order: 3,
  }),
];

export function mockProductWithCategory(slug: string): ProductWithCategory | null {
  const p = mockProducts.find((x) => x.slug === slug);
  if (!p) return null;
  const category = mockCategories.find((c) => c.id === p.category_id) ?? null;
  return { ...p, categories: category };
}
