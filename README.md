# TOTO 衛浴 — 商品成列網站

TOTO 衛浴商品展示網站，含公開前台（依分類瀏覽、商品詳情）與後台管理（單一管理者登入後新增 / 維護商品）。技術棧：**Next.js 16 (App Router) + Supabase + Tailwind CSS v4**，部署於 **Vercel + Supabase**。

> 之後會再加入一個類似 Linktree 的導覽頁面（尚未開始）。

## 本機開發設定

### 1. 建立 Supabase 專案
1. 在 [supabase.com](https://supabase.com) 建立專案。
2. 進入 **SQL Editor**，貼上並執行 `supabase/migrations/0001_init.sql`（建立資料表、RLS 政策與 `product-images` 儲存桶）。
3. 想要範例資料，再執行 `supabase/seed.sql`。

### 2. 設定環境變數
複製 `.env.example` 為 `.env.local`，從 Supabase **Project Settings → API** 填入：

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # 僅供伺服器使用，切勿外洩
```

### 3. 建立後台管理者帳號
本站**沒有公開註冊**。在 Supabase **Authentication → Users → Add user** 手動建立一組 email / 密碼，並勾選 auto-confirm。任何登入的使用者即視為後台管理者。

### 4. 啟動
```bash
npm install
npm run dev
```
- 前台：http://localhost:3000
- 後台：http://localhost:3000/admin（未登入會導向 `/admin/login`）

## 常用指令
```bash
npm run dev     # 開發伺服器（Turbopack）
npm run build   # 正式建置（含 TypeScript 型別檢查）
npm run lint    # ESLint
```

## 部署到 Vercel
1. 將 repo 連到 Vercel。
2. 在 **Settings → Environment Variables** 加入上述三個變數（與 `.env.local` 相同）。
3. Vercel 會自動以 `npm run build` 建置 Next.js。

## 專案結構與架構
詳見 [`CLAUDE.md`](./CLAUDE.md)。重點：
- `src/app/(storefront)/` — 公開前台頁面
- `src/app/admin/` — 後台管理（登入、商品 CRUD）
- `src/lib/supabase/` — 三種 Supabase client（瀏覽器 / 伺服器 / service-role）與 `proxy.ts` session 更新
- `supabase/` — 資料庫 migration 與種子資料
