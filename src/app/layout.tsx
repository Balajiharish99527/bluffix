import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "BLUFFIX | Strategic Word Infiltration",
  description: "A sleek, high-stakes multiplayer word deduction game.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}
