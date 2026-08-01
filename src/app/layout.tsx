import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chamindu Gimhana's O/L AI Study Tracker Pro",
  description: "Premium black-and-gold O/L 2026 preparation system for independent study and tuition management.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0A] text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
