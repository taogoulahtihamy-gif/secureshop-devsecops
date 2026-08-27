"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import StorePage from "@/components/StorePage";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/lib/shop";

const categories = [
  { name: "Mode homme", apiCategory: "men's clothing", description: "Des essentiels actuels pour chaque journée.", preferredProductId: 2 },
  { name: "Mode femme", apiCategory: "women's clothing", description: "Des pièces modernes, faciles à porter.", preferredProductId: 15 },
  { name: "Bijoux", apiCategory: "jewelery", description: "Des détails élégants pour compléter votre style.", preferredProductId: 5 },
  { name: "Électronique", apiCategory: "electronics", description: "La technologie utile au quotidien.", preferredProductId: 13 },
];

const benefits = [
  {
    title: "Livraison rapide",
    description: "Vos achats préparés avec soin et acheminés dans les meilleurs délais.",
    icon: <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
  },
  {
    title: "Paiement sécurisé",
    description: "Une expérience pensée pour protéger chaque étape de votre commande.",
    icon: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  },
  {
    title: "Assistance client",
    description: "Une équipe disponible pour vous accompagner et répondre à vos questions.",
    icon: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><path d="M4 14a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2v1ZM20 14a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2v1ZM17 18c-1 2-3 3-5 3" /></>,
  },
];

export default function AccueilPage() {
  const { products, loading } = useShop();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const popularProducts = products.slice(0, 4);
  const categoryCards = useMemo(() => categories.map((category) => ({
    ...category,
    image: products.find((product) => product.id === category.preferredProductId)?.image
      ?? products.find((product) => product.category === category.apiCategory)?.image,
  })), [products]);

  return (
    <StorePage>
      <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="eyebrow">BIENVENUE CHEZ SECURESHOP</p>
          <h1>Le shopping moderne,<br />livré en toute confiance</h1>
          <p>Découvrez une sélection pensée pour votre quotidien, avec des prix clairs et une expérience simple du premier clic à la commande.</p>
          <Link className="home-hero-button" href="/boutique">
            Découvrir la boutique
            <svg className="arrow-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading"><p className="eyebrow">EXPLOREZ</p><h2>Nos catégories</h2><p>Une sélection variée pour répondre à toutes vos envies.</p></div>
        <div className="home-categories">
          {(loading || categoryCards.some((category) => !category.image))
            ? Array.from({ length: 4 }, (_, index) => <div className="category-image-card category-card-skeleton" aria-hidden="true" key={index} />)
            : categoryCards.map((category) => (
              <Link
                className="category-image-card"
                href={`/boutique?categorie=${encodeURIComponent(category.apiCategory)}`}
                aria-label={`Découvrir la catégorie ${category.name}`}
                key={category.name}
              >
                <img src={category.image} alt={`Sélection ${category.name.toLocaleLowerCase("fr")}`} />
                <span className="category-card-overlay" aria-hidden="true" />
                <span className="category-card-content">
                  <strong>{category.name}</strong>
                  <small>{category.description}</small>
                </span>
                <svg className="category-card-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            ))}
        </div>
      </section>

      <section className="home-section home-popular">
        <div className="home-section-heading heading-row"><div><p className="eyebrow">NOS FAVORIS</p><h2>Produits populaires</h2></div><Link href="/boutique">Voir tous les produits</Link></div>
        <div className="product-grid home-products">
          {loading && Array.from({ length: 4 }, (_, index) => <article className="product-card skeleton-card" key={index}><div className="skeleton skeleton-image" /><div className="skeleton skeleton-line" /></article>)}
          {!loading && popularProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />)}
        </div>
      </section>

      <section className="home-benefits" aria-label="Nos avantages">
        {benefits.map((benefit) => (
          <article className="feature-card" key={benefit.title}><span className="feature-icon-shell"><svg className="feature-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" viewBox="0 0 24 24">{benefit.icon}</svg></span><div><h2>{benefit.title}</h2><p>{benefit.description}</p></div></article>
        ))}
      </section>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      </div>
    </StorePage>
  );
}
