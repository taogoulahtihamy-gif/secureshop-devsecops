"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import StoreHeader from "./StoreHeader";
import StoreFooter from "./StoreFooter";

export default function StorePage({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { ready, token, notice, clearNotice } = useShop();

  useEffect(() => {
    if (ready && !token) router.replace("/");
  }, [ready, token, router]);

  if (!ready || !token) return <main className="route-loading">Chargement sécurisé…</main>;

  return (
    <main className="store-shell">
      <StoreHeader />
      {children}
      <StoreFooter />
      {notice && (
        <div className="cart-toast" role="status">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>
          {notice}
          <button type="button" onClick={clearNotice} aria-label="Fermer la notification">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
      )}
    </main>
  );
}
