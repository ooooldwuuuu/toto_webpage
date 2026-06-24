import type { Metadata } from "next";
import Link from "next/link";
import { Storefront, Tag } from "@phosphor-icons/react/dist/ssr";

import { StoreInfo } from "@/app/links/store-info";

export const metadata: Metadata = {
  title: { absolute: "泉昌水電材料 & 金品衛浴" },
  description:
    "泉昌水電材料行與 TOTO 金品衛浴設備的 LINE、門市資訊、電話與線上型錄。",
};

/**
 * Linktree-style link hub for 泉昌水電材料 & 金品衛浴. Standalone page (outside the
 * storefront route group) so it carries no shop header/footer. Cover banner +
 * overlapping avatar + a 2-column grid of links; item 3 opens a store-info
 * pop-up card (see store-info.tsx).
 * TODO: replace the cover photo and avatar placeholders with real assets.
 */

type LinkItem = {
  label: string;
  sub: string;
  href: string;
} & (
  | { kind: "brand"; slug: string; color: string } // brand mark via Simple Icons
  | { kind: "action"; Icon: typeof Storefront } // UI action via Phosphor
);

const lineQuanchang: LinkItem = {
  kind: "brand",
  label: "泉昌水電材料のLINE",
  sub: "加入好友",
  href: "https://line.me/ti/p/6wAaLeDSf1",
  slug: "line",
  color: "#06C755",
};

const lineJinpin: LinkItem = {
  kind: "brand",
  label: "金品衛浴のLINE",
  sub: "加入好友",
  href: "https://line.me/ti/p/uApXbM5sUt",
  slug: "line",
  color: "#06C755",
};

const facebookJinpin: LinkItem = {
  kind: "brand",
  label: "金品衛浴のFB",
  sub: "粉絲專頁",
  href: "https://www.facebook.com/profile.php?id=100078508832016",
  slug: "facebook",
  color: "#1877F2",
};

const browseProducts: LinkItem = {
  kind: "action",
  label: "瀏覽各式商品",
  sub: "線上型錄",
  href: "/",
  Icon: Storefront,
};

const totoSale: LinkItem = {
  kind: "action",
  label: "TOTO 特價專區",
  sub: "優惠商品",
  href: "/",
  Icon: Tag,
};

function isInternal(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

function LinkButton({ item, index }: { item: LinkItem; index: number }) {
  const className =
    "group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-all animate-rise hover:-translate-y-1 hover:border-accent hover:shadow-[0_18px_40px_-28px_rgba(0,84,166,0.4)] active:translate-y-0";

  const chip =
    item.kind === "brand" ? (
      <span
        aria-hidden
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-center bg-no-repeat"
        style={{
          backgroundColor: item.color,
          backgroundImage: `url(https://cdn.simpleicons.org/${item.slug}/ffffff)`,
          backgroundSize: "56%",
        }}
      />
    ) : (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
        <item.Icon size={22} weight="regular" />
      </span>
    );

  const inner = (
    <>
      {chip}
      <div className="min-w-0">
        <p className="font-semibold text-foreground transition-colors group-hover:text-accent">
          {item.label}
        </p>
        <p className="text-xs text-muted">{item.sub}</p>
      </div>
    </>
  );

  const style = { animationDelay: `${0.06 * index}s` };

  if (isInternal(item.href)) {
    return (
      <Link href={item.href} className={className} style={style}>
        {inner}
      </Link>
    );
  }

  return (
    <a
      href={item.href}
      className={className}
      style={style}
      target="_blank"
      rel="noopener noreferrer"
    >
      {inner}
    </a>
  );
}

export default function LinksPage() {
  return (
    <>
      {/* TODO: replace the branded gradient with the real 封面照 cover photo. */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-accent to-accent-hover sm:h-60">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -bottom-8 h-64 w-64 bg-contain bg-no-repeat opacity-10 invert"
          style={{ backgroundImage: "url(/placeholders/toilet.svg)" }}
        />
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4">
        <header className="flex animate-rise flex-col items-center text-center">
          {/* TODO: replace the placeholder mark with the real 大頭照 avatar. */}
          <div className="-mt-14 flex h-28 w-28 items-center justify-center rounded-full border-4 border-background bg-surface shadow-md">
            <span className="text-xl font-bold tracking-tight text-accent">
              金品
            </span>
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            泉昌水電材料 &amp; 金品衛浴
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            屏東潮州 · TOTO 衛浴設備與水電材料
          </p>
        </header>

        <section className="relative mt-10 pb-16">
          {/* Toilet motif as a faint backing behind the buttons (brand wink). */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 bg-contain bg-center bg-no-repeat opacity-[0.04]"
            style={{ backgroundImage: "url(/placeholders/toilet.svg)" }}
          />
          <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
            <LinkButton item={lineQuanchang} index={0} />
            <LinkButton item={lineJinpin} index={1} />
            <StoreInfo index={2} />
            <LinkButton item={facebookJinpin} index={3} />
            <LinkButton item={browseProducts} index={4} />
            <LinkButton item={totoSale} index={5} />
          </div>
        </section>
      </div>

      <footer className="pb-10 text-center text-xs text-muted">
        © {new Date().getFullYear()} 泉昌水電材料 & 金品衛浴
      </footer>
    </>
  );
}
