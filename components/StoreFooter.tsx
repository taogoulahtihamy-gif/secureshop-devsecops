import Link from "next/link";

export default function StoreFooter() {
  return (
    <footer className="store-footer">
      <Link className="brand" href="/accueil">SecureShop</Link>
      <nav aria-label="Liens de pied de page">
        <Link href="/boutique">Boutique</Link>
        <Link href="/a-propos">À propos</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <p>© 2026 SecureShop — Tous droits réservés.</p>
    </footer>
  );
}
