"use client";

import { useShop } from "@/context/ShopContext";
import { cfa, Product, translateCategory, translatedTitle } from "@/lib/shop";
import ProductRating from "./ProductRating";

export default function ProductCard({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }) {
  const { favorites, toggleFavorite, addToCart } = useShop();
  const favorite = favorites.has(product.id);
  const title = translatedTitle(product);

  return (
    <article className="product-card">
      <div className="product-image">
        {product.id % 4 === 1 && <span className="product-badge badge-new">Nouveau</span>}
        {product.id % 4 === 0 && <span className="product-badge badge-sale">Promo</span>}
        <button
          className={`heart ${favorite ? "favorite" : ""}`}
          type="button"
          onClick={() => toggleFavorite(product.id)}
          aria-label={`${favorite ? "Retirer" : "Ajouter"} ${title} ${favorite ? "des" : "aux"} favoris`}
          aria-pressed={favorite}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
        </button>
        <button className="product-image-button" type="button" onClick={() => onOpen(product)} aria-label={`Voir ${title}`}>
          <img src={product.image} alt={title} />
        </button>
        <button className="view-product" type="button" onClick={() => onOpen(product)}>Voir le produit</button>
      </div>
      <div className="product-details">
        <p className="category">{translateCategory(product.category)}</p>
        <button className="product-title-button" type="button" onClick={() => onOpen(product)}><h3>{title}</h3></button>
        <ProductRating rating={product.rating} />
        <div className="product-footer">
          <strong>{cfa(product.price)}</strong>
          <button type="button" onClick={() => addToCart(product.id)} aria-label={`Ajouter ${title} au panier`}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21 7H6M12 9v4M10 11h4" /></svg>
            Ajouter
          </button>
        </div>
      </div>
    </article>
  );
}
