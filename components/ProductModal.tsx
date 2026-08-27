"use client";

import { useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { cfa, Product, translateCategory, translatedDescription, translatedTitle } from "@/lib/shop";
import ProductRating from "./ProductRating";

export default function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addToCart } = useShop();

  useEffect(() => {
    if (!product) return;
    const overflow = document.body.style.overflow;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", escape);
    };
  }, [product, onClose]);

  if (!product) return null;
  const title = translatedTitle(product);
  return (
    <div className="product-modal-backdrop" onMouseDown={onClose}>
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fermer la fenêtre du produit">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <div className="modal-image"><img src={product.image} alt={title} /></div>
        <div className="modal-content">
          <p className="category">{translateCategory(product.category)}</p>
          <h2 id="product-modal-title">{title}</h2>
          <ProductRating rating={product.rating} />
          <p className="modal-description">{translatedDescription(product)}</p>
          <strong className="modal-price">{cfa(product.price)}</strong>
          <button className="modal-cart-button" type="button" onClick={() => { addToCart(product.id); onClose(); }}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M3 3h2l2.4 11.2a2 2 0 0 0 2-1.6L21 7H6M12 9v4M10 11h4" /></svg>
            Ajouter au panier
          </button>
        </div>
      </section>
    </div>
  );
}
