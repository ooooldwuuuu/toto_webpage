import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Storefront } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "聯絡與連結",
  description: "TOTO 衛浴的 LINE、電話、Facebook 與線上型錄等聯絡方式。",
};

/**
 * Linktree-style link hub. Standalone page (outside the storefront route
 * group) so it carries no shop header/footer. Cover banner + overlapping
 * avatar + a 2-column grid of link buttons that collapses to one column on
 * mobile. All links/images below are PLACEHOLDERS — replace with real assets.
 */

type LinkItem = {
  label: string;
  sub: string;
  href: string;
} & (
  | { kind: "brand"; slug: string; color: string } // brand mark via Simple Icons
  | { kind: "action"; Icon: typeof Phone } // UI action via Phosphor
);

// TODO: replace hrefs with the real LINE / 電話 / Facebook / 地址 destinations.
const links: LinkItem[] = [
  {
    kind: "brand",
    label: "LINE 諮詢",
    sub: "加入官方帳號",
    href: "https://line.me/",
    slug: "line",
    color: "#06C755",
  },
  {
    kind: "action",
    label: "電話聯繫",
    sub: "撥打門市電話",
    href: "tel:+886200000000",
    Icon: Phone,
  },
  {
    kind: "brand",
    label: "Facebook",
    sub: "粉絲專頁",
    href: "https://www.facebook.com/",
    slug: "facebook",
    color: "#1877F2",
  },
  {
    kind: "action",
    label: "瀏覽商品",
    sub: "線上型錄",
    href: "/",
    Icon: Storefront,
  },
  {
    kind: "action",
    label: "門市資訊",
    sub: "地址與營業時間",
    href: "#",
    Icon: MapPin,
  },
];

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

  const external = item.href.startsWith("http");
  return (
    <a
      href={item.href}
      className={className}
      style={style}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
        <header className="flex flex-col items-center text-center animate-rise">
          {/* TODO: replace the placeholder mark with the real 大頭照 avatar. */}
          <div className="-mt-14 flex h-28 w-28 items-center justify-center rounded-full border-4 border-background bg-surface shadow-md">
            <span className="text-2xl font-bold tracking-tight text-accent">
              TOTO
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            TOTO 衛浴
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            精選日本衛浴 · 門市諮詢與安裝
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
            {links.map((item, index) => (
              <LinkButton key={item.label} item={item} index={index} />
            ))}
          </div>
        </section>
      </div>

      <footer className="pb-10 text-center text-xs text-muted">
        © {new Date().getFullYear()} TOTO 衛浴
      </footer>
    </>
  );
}
