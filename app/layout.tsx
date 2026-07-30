import type { Metadata } from "next";
    import "./globals.css";

    export const metadata: Metadata = {
      title: "Lunilooks Beauty",
      description: "Platform Booking Lunilooks Beauty Class",
    };

    export default function RootLayout({
      children,
    }: Readonly<{
      children: React.ReactNode;
    }>) {
      return (
        <html lang="en">
          <body>{children}</body>
        </html>
      );
    }