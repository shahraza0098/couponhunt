import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CouponHunt — Find the Best Coupons, Deals & Promo Codes",
    template: "%s | CouponHunt",
  },
  description:
    "Discover verified coupons, promo codes, and exclusive deals from top Indian stores. Save money on electronics, fashion, food, travel, and more with CouponHunt.",
  keywords: [
    "coupons",
    "deals",
    "promo codes",
    "discounts",
    "offers",
    "savings",
    "India",
    "online shopping",
  ],
  openGraph: {
    type: "website",
    siteName: "CouponHunt",
    title: "CouponHunt — Find the Best Coupons, Deals & Promo Codes",
    description:
      "Discover verified coupons, promo codes, and exclusive deals from top Indian stores.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
