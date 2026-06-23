import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Traditional Chinese face for body + headings; Geist leads for Latin/numerals.
const notoTC = Noto_Sans_TC({
  variable: "--font-noto-tc",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TOTO 衛浴｜精選商品",
    template: "%s｜TOTO 衛浴",
  },
  description: "TOTO 衛浴精選商品成列，馬桶、免治馬桶座、面盆、龍頭與浴缸。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} ${notoTC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
