export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted sm:px-6 lg:px-8">
        <p className="font-semibold text-foreground">TOTO 衛浴</p>
        <p className="mt-2">精選 TOTO 衛浴商品成列展示。商品價格與供貨狀況請來電洽詢。</p>
        <p className="mt-4 text-xs">
          © {new Date().getFullYear()} TOTO 衛浴. 本站為商品展示用途。
        </p>
      </div>
    </footer>
  );
}
