import type { Metadata } from "next";
import { ShopProvider } from "@/context/ShopContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecureShop",
  description: "Une expérience d’achat moderne, simple et agréable.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body><ShopProvider>{children}</ShopProvider></body>
    </html>
  );
}
