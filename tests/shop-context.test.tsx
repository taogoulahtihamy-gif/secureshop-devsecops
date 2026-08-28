import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import PanierPage from "@/app/panier/page";
import { ShopProvider, useShop } from "@/context/ShopContext";

const product = {
  id: 101,
  title: "Produit persistant",
  price: 25,
  category: "electronics",
  description: "Produit de test",
  image: "product.jpg",
  rating: { rate: 4.5, count: 12 },
};

vi.mock("@/components/StorePage", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function ContextProbe() {
  const { products, cartCount, favorites, addToCart, toggleFavorite } = useShop();
  return (
    <div>
      <span>Produits : {products.map(({ title }) => title).join(", ")}</span>
      <span>Panier : {cartCount}</span>
      <span>Favoris : {favorites.size}</span>
      <button type="button" onClick={() => addToCart(product.id)}>Ajouter au panier</button>
      <button type="button" onClick={() => toggleFavorite(product.id)}>Ajouter aux favoris</button>
    </div>
  );
}

describe("ShopContext et panier", () => {
  beforeEach(() => {
    localStorage.setItem("secureshop-token", "token-utilisateur");
    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: true,
      json: async () => [product],
    })));
  });

  it("charge et affiche les produits de Fake Store API avec un token présent", async () => {
    render(<ShopProvider><ContextProbe /></ShopProvider>);

    expect(await screen.findByText(`Produits : ${product.title}`)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "https://fakestoreapi.com/products",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("ajoute, augmente et diminue une quantité sans jamais devenir négative", async () => {
    const user = userEvent.setup();
    localStorage.setItem("secureshop-cart", JSON.stringify({ [product.id]: 1 }));
    render(<ShopProvider><PanierPage /></ShopProvider>);

    const increase = await screen.findByRole("button", { name: /augmenter la quantité/i });
    const decrease = screen.getByRole("button", { name: /diminuer la quantité/i });
    expect(screen.getByLabelText("Quantité : 1")).toBeInTheDocument();

    await user.click(increase);
    expect(screen.getByLabelText("Quantité : 2")).toBeInTheDocument();
    await user.click(decrease);
    expect(screen.getByLabelText("Quantité : 1")).toBeInTheDocument();
    await user.click(decrease);

    expect(await screen.findByText(/votre panier est vide/i)).toBeInTheDocument();
    expect(screen.getByText(/0 article\(s\)/i)).toBeInTheDocument();
  });

  it("supprime réellement un produit du panier", async () => {
    const user = userEvent.setup();
    localStorage.setItem("secureshop-cart", JSON.stringify({ [product.id]: 1 }));
    render(<ShopProvider><PanierPage /></ShopProvider>);

    expect(await screen.findByText(product.title)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    expect(screen.queryByText(product.title)).not.toBeInTheDocument();
    expect(screen.getByText(/votre panier est vide/i)).toBeInTheDocument();
  });

  it("vide complètement le panier et ramène cartCount à zéro", async () => {
    const user = userEvent.setup();
    localStorage.setItem("secureshop-cart", JSON.stringify({ [product.id]: 3 }));
    render(<ShopProvider><PanierPage /></ShopProvider>);

    expect(await screen.findByText(product.title)).toBeInTheDocument();
    expect(screen.getByText(/3 article\(s\)/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /vider le panier/i }));

    expect(screen.getByText(/0 article\(s\)/i)).toBeInTheDocument();
    expect(screen.getByText(/votre panier est vide/i)).toBeInTheDocument();
  });

  it("persiste le panier et les favoris dans localStorage", async () => {
    const user = userEvent.setup();
    render(<ShopProvider><ContextProbe /></ShopProvider>);
    await screen.findByText(`Produits : ${product.title}`);

    await user.click(screen.getByRole("button", { name: /ajouter au panier/i }));
    await user.click(screen.getByRole("button", { name: /ajouter aux favoris/i }));

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("secureshop-cart") ?? "{}"))
        .toEqual({ [product.id]: 1 });
      expect(JSON.parse(localStorage.getItem("secureshop-favorites") ?? "[]"))
        .toEqual([product.id]);
    });
  });
});
