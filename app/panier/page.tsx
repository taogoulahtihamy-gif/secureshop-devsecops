"use client";

import Link from "next/link";
import { useState } from "react";
import StorePage from "@/components/StorePage";
import { useShop } from "@/context/ShopContext";
import { cfa, translatedTitle } from "@/lib/shop";

export default function PanierPage() {
  const { products, cart, cartCount, cartTotal, changeQuantity, removeFromCart, clearCart } = useShop();
  const [success, setSuccess] = useState("");
  const cartProducts = products.filter((product) => cart[product.id]);

  const checkout = () => {
    if (!window.confirm(`Confirmer cette commande d’un montant de ${cfa(cartTotal)} ?`)) return;
    clearCart();
    setSuccess("Votre commande a été validée avec succès");
  };

  return (
    <StorePage>
      <section className="route-page cart-page">
        <div className="route-heading"><p className="eyebrow">VOTRE COMMANDE</p><h1>Mon panier</h1><p>{cartCount} article(s) dans votre panier.</p></div>
        {success && <p className="order-success" role="status">{success}</p>}
        {cartProducts.length === 0 ? (
          <div className="route-empty"><h2>Votre panier est vide</h2><p>Découvrez notre catalogue et ajoutez les produits qui vous plaisent.</p><Link className="primary-link" href="/boutique">Découvrir la boutique</Link></div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {cartProducts.map((product) => (
                <article className="cart-page-item" key={product.id}>
                  <img src={product.image} alt={translatedTitle(product)} />
                  <div className="cart-item-copy"><h2>{translatedTitle(product)}</h2><span>Prix unitaire : {cfa(product.price)}</span><strong>Sous-total : {cfa(product.price * cart[product.id])}</strong></div>
                  <div className="cart-item-controls">
                    <div className="quantity">
                      <button type="button" onClick={() => changeQuantity(product.id, -1)} aria-label={`Diminuer la quantité de ${translatedTitle(product)}`}>−</button>
                      <span aria-label={`Quantité : ${cart[product.id]}`}>{cart[product.id]}</span>
                      <button type="button" onClick={() => changeQuantity(product.id, 1)} aria-label={`Augmenter la quantité de ${translatedTitle(product)}`}>+</button>
                    </div>
                    <button className="remove-cart-item" type="button" onClick={() => removeFromCart(product.id)}>Supprimer</button>
                  </div>
                </article>
              ))}
            </div>
            <aside className="cart-summary">
              <h2>Récapitulatif</h2><p><span>Articles</span><strong>{cartCount}</strong></p><p className="summary-total"><span>Total</span><strong>{cfa(cartTotal)}</strong></p>
              <button className="primary-button" type="button" onClick={checkout}>Valider la commande</button>
              <button className="secondary-button" type="button" onClick={clearCart}>Vider le panier</button>
              <Link href="/boutique">Continuer mes achats</Link>
            </aside>
          </div>
        )}
      </section>
    </StorePage>
  );
}
