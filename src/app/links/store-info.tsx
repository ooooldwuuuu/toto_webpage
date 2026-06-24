"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  NavigationArrow,
  Phone,
  X,
} from "@phosphor-icons/react/dist/ssr";

const stores = [
  {
    name: "泉昌水電材料行",
    address: "屏東縣潮州鎮中山路167號",
    phones: ["08-7882390", "08-7884632"],
  },
  {
    name: "TOTO 金品衛浴設備",
    address: "屏東縣潮州鎮中山路165號",
    phones: ["08-7803398"],
  },
];

const salesContacts = [
  { name: "宗霖", phone: "0975-289151" },
  { name: "徐小姐", phone: "0911-978256" },
];

function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}

export function StoreInfo({ index }: { index: number }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ animationDelay: `${0.06 * index}s` }}
        className="group flex animate-rise items-center gap-4 rounded-2xl border border-border bg-surface p-4 text-left transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[0_18px_40px_-28px_rgba(0,84,166,0.4)] active:translate-y-0"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <MapPin size={22} weight="regular" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-foreground transition-colors group-hover:text-accent">
            門市資訊 &amp; 電話聯繫
          </p>
          <p className="text-xs text-muted">地址、地圖與電話</p>
        </div>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="門市資訊與聯絡方式"
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
        >
          <button
            type="button"
            aria-label="關閉"
            onClick={() => setOpen(false)}
            className="absolute inset-0 animate-fade bg-foreground/40 backdrop-blur-sm"
          />
          <div className="relative z-10 max-h-[85vh] w-full max-w-md animate-pop overflow-y-auto rounded-t-2xl border border-border bg-surface shadow-2xl sm:rounded-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-5 py-4">
              <h2 className="text-base font-bold text-foreground">
                門市資訊 &amp; 聯絡方式
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="關閉"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-accent-soft hover:text-accent"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              {stores.map((store) => (
                <div
                  key={store.name}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <p className="font-semibold text-foreground">{store.name}</p>
                  <a
                    href={mapsUrl(`${store.name} ${store.address}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 flex items-start gap-1.5 text-sm text-muted transition-colors hover:text-accent"
                  >
                    <NavigationArrow
                      size={16}
                      weight="fill"
                      className="mt-0.5 shrink-0"
                    />
                    {store.address}
                  </a>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {store.phones.map((phone) => (
                      <a
                        key={phone}
                        href={telHref(phone)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent transition-opacity hover:opacity-80"
                      >
                        <Phone size={15} weight="fill" />
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  衛浴設備業務
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {salesContacts.map((c) => (
                    <a
                      key={c.phone}
                      href={telHref(c.phone)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      <Phone size={15} weight="regular" />
                      {c.name} {c.phone}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
