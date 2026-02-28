import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scout — VC Intelligence",
  description: "Precision AI sourcing for venture capital",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
