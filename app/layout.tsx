import type { Metadata } from "next";
import "./globals.css";

// Menggunakan Hero Image dari Landing Page Anda sebagai OG Image & Favicon
const BRAND_IMAGE = "/images/og-image.webp?auto=format&fit=crop&q=80";
const ICON = "/Icon-luni.ico";


export const metadata: Metadata = {
  title: "Lunilooks Beauty | Self Makeup Class",
  description: "Platform Booking Lunilooks Beauty Class. Pelajari makeup natural yang mudah diterapkan untuk aktivitas sehari-hari bersama Clara Henita Leluni.",
  keywords: ["Makeup Class", "Self Makeup", "Lunilooks", "Beauty Class", "Kursus Makeup", "Palangkaraya"],
  
  // Mengatur Favicon dari URL Gambar
  icons: {
    icon: ICON,
    apple: ICON,
    shortcut: ICON,
  },

  // Konfigurasi Open Graph (Untuk WhatsApp, Facebook, LinkedIn, Threads)
  openGraph: {
    title: "Lunilooks Beauty | Self Makeup Class",
    description: "Stop bilang 'Aku Gak Bisa Makeup'! Ikuti Self Makeup Class bersama Lunilooks dan pelajari makeup natural untuk sehari-hari.",
    url: "https://lunilooks-platform.pages.dev", // Ganti dengan domain asli Anda nanti (misal: lunilooks.com)
    siteName: "Lunilooks Beauty",
    images: [
      {
        url: BRAND_IMAGE,
        width: 1200, // Rekomendasi rasio gambar OG
        height: 630,
        alt: "Lunilooks Beauty Class Banner",
      },
    ],
    locale: "id_ID", // Lokalisasi Bahasa Indonesia
    type: "website",
  },

  // Konfigurasi Twitter Card (Untuk X/Twitter dan alternatif rendering Threads)
  twitter: {
    card: "summary_large_image",
    title: "Lunilooks Beauty | Self Makeup Class",
    description: "Stop bilang 'Aku Gak Bisa Makeup'! Ikuti Self Makeup Class bersama Lunilooks.",
    creator: "@lunilooks",
    images: [BRAND_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content="#FDFBF7" />
      </head>
      <body>{children}</body>
    </html>
  );
}