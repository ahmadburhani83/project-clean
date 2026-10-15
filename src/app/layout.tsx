import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PartnerSelectorModal } from "@/components/partner/PartnerSelectorModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Clean Indonesia | Toko Kimia & Produk Kimia Rumah Tangga - Order via Mitra Daerah",
  description:
    "Pusat pasokan bahan kimia teknis, deterjen laundry, sabun cuci piring, karbol, dan bahan baku industri. Pesan via toko mitra daerah terdekat di kota Anda untuk hemat ongkos kirim dan pengiriman instan.",
  keywords: [
    "toko kimia terdekat",
    "sabun cuci piring kiloan",
    "deterjen laundry konsentrat",
    "soda api caustic soda",
    "texapon sles",
    "karbol wangi pinus",
    "mitra kimia daerah",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <PartnerSelectorModal />
      </body>
    </html>
  );
}
