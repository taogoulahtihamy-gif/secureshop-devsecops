"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import StorePage from "@/components/StorePage";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { useShop } from "@/context/ShopContext";
import { cfa, Product, translateCategory, translatedTitle } from "@/lib/shop";

const validCategories = ["men's clothing", "women's clothing", "jewelery", "electronics"];

export default function BoutiquePage() {
  const searchParams = useSearchParams();
  const { products, loading, error } = useShop();
  const requestedCategory = searchParams.get("categorie");
  const [category, setCategory] = useState(
    requestedCategory && validCategories.includes(requestedCategory)
      ? requestedCategory
      : "all",
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    queueMicrotask(() => setCategory(
      requestedCategory && validCategories.includes(requestedCategory)
        ? requestedCategory
        : "all",
    ));
  }, [requestedCategory]);

  const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products]);
  const visibleProducts = useMemo(() => products
    .filter((product) => {
      const translatedQuery = query.trim().toLocaleLowerCase("fr");
      return (category === "all" || product.category === category)
        && translatedTitle(product).toLocaleLowerCase("fr").includes(translatedQuery)
        && product.price <= maxPrice;
    })
    .sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : a.id - b.id),
  [products, category, query, maxPrice, sort]);

  const resetFilters = () => { setCategory("all"); setQuery(""); setSort("featured"); setMaxPrice(1000); };

  return (
    <StorePage>
      <section className="shop-card boutique-only" aria-label="Catalogue SecureShop">
        <aside className="sidebar">
          <h2>Catégories</h2>
          <button type="button" className={category === "all" ? "side-active" : ""} onClick={() => setCategory("all")}><i />Tous les produits</button>
          {categories.map((item) => (
            <button type="button" key={item} className={category === item ? "side-active" : ""} onClick={() => setCategory(item)}><i />{translateCategory(item)}</button>
          ))}
          <div className="side-section">
            <h2>Prix maximum</h2>
            <div className="price-label"><span>0 F CFA</span><strong>{cfa(maxPrice)}</strong></div>
            <input type="range" min="20" max="1000" step="20" value={maxPrice} aria-label="Prix maximum" onChange={(event) => setMaxPrice(Number(event.target.value))} />
          </div>
        </aside>

        <div className="shop-content">
          <section className="promo-banner" aria-labelledby="promo-title">
            <div><span>ÉDITION 2026</span><h1 id="promo-title">Découvrez notre nouvelle collection</h1><p>Des essentiels sélectionnés pour un style juste et actuel.</p></div>
            <button type="button" onClick={() => document.getElementById("produits")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
              Explorer la collection
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </section>
          <div className="shop-tools">
            <div className="search-wrap">
              <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un produit…" aria-label="Rechercher un produit" />
            </div>
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Trier les produits">
              <option value="featured">En vedette</option><option value="low">Prix croissant</option><option value="high">Prix décroissant</option>
            </select>
          </div>
          <div className="category-strip">
            <button type="button" className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>Tous</button>
            {categories.map((item) => <button type="button" key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{translateCategory(item)}</button>)}
          </div>
          <div className="results-line"><strong>{visibleProducts.length} produits</strong><span>La sélection SecureShop</span></div>
          {error && <p className="alert" role="alert">{error}</p>}
          <div className="product-grid" id="produits">
            {loading && Array.from({ length: 8 }, (_, index) => <article className="product-card skeleton-card" key={index}><div className="skeleton skeleton-image" /><div className="skeleton skeleton-line short" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line medium" /><div className="skeleton skeleton-button" /></article>)}
            {!loading && visibleProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />)}
            {!loading && !error && visibleProducts.length === 0 && (
              <div className="empty-state"><h2>Aucun produit trouvé</h2><p>Essayez une autre recherche ou réinitialisez vos filtres.</p><button type="button" onClick={resetFilters}>Réinitialiser les filtres</button></div>
            )}
          </div>
        </div>
      </section>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </StorePage>
  );
}
