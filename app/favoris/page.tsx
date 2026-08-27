"use client";

import Link from "next/link";
import { useState } from "react";
import StorePage from "@/components/StorePage";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/lib/shop";

export default function FavorisPage() {
  const { products, favorites, loading } = useShop();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const favoriteProducts = products.filter((product) => favorites.has(product.id));

  return (
    <StorePage>
      <section className="route-page">
        <div className="route-heading"><p className="eyebrow">VOTRE SÉLECTION</p><h1>Mes favoris</h1><p>Retrouvez ici tous les produits que vous souhaitez garder à portée de main.</p></div>
        {!loading && favoriteProducts.length === 0 ? (
          <div className="route-empty"><h2>Vous n’avez aucun produit favori</h2><p>Parcourez notre sélection et utilisez le cœur pour enregistrer un produit.</p><Link className="primary-link" href="/boutique">Découvrir la boutique</Link></div>
        ) : (
          <div className="product-grid favorites-page-grid">{favoriteProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />)}</div>
        )}
      </section>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </StorePage>
  );
}
