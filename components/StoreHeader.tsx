"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useShop } from "@/context/ShopContext";

const links = [
  { href: "/accueil", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function StoreHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, favoriteCount, logout } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);

  const disconnect = () => {
    logout();
    router.replace("/");
  };

  return (
    <header className="store-header">
      <Link className="brand" href="/accueil">SecureShop</Link>

      <button
        className="mobile-menu-button"
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={menuOpen}
        aria-controls="store-navigation"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <nav id="store-navigation" className={menuOpen ? "mobile-open" : ""} aria-label="Navigation principale">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "active-link" : ""}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <Link className="icon-button" href="/favoris" aria-label={`Favoris : ${favoriteCount} produit(s)`}>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>
          <b aria-hidden="true">{favoriteCount}</b>
        </Link>
        <Link className="icon-button" href="/panier" aria-label={`Panier : ${cartCount} article(s)`}>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="9" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
            <path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21 7H6" />
          </svg>
          <b aria-hidden="true">{cartCount}</b>
        </Link>
        <button className="account-button" type="button" onClick={disconnect}>Déconnexion</button>
      </div>
    </header>
  );
}
