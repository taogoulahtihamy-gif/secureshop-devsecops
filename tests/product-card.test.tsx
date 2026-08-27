import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ProductCard from "@/components/ProductCard";

const addToCart = vi.fn();
const toggleFavorite = vi.fn();

vi.mock("@/context/ShopContext", () => ({
  useShop: () => ({
    favorites: new Set<number>(),
    toggleFavorite,
    addToCart,
  }),
}));

const product = {
  id: 1,
  title: "Sac de test",
  price: 29.99,
  category: "electronics",
  description: "Produit utilisé pour les tests",
  image: "https://example.com/product.jpg",
  rating: {
    rate: 4.5,
    count: 100,
  },
};

describe("ProductCard", () => {
  it("ajoute un produit au panier", async () => {
    const user = userEvent.setup();

    render(
      <ProductCard
        product={product}
        onOpen={vi.fn()}
      />,
    );

    const button = screen.getByRole("button", {
      name: /ajouter .* au panier/i,
    });

    await user.click(button);

    expect(addToCart).toHaveBeenCalledWith(1);
  });

  it("ajoute un produit aux favoris", async () => {
    const user = userEvent.setup();

    render(
      <ProductCard
        product={product}
        onOpen={vi.fn()}
      />,
    );

    const favoriteButton = screen.getByRole("button", {
      name: /ajouter .* aux favoris/i,
    });

    await user.click(favoriteButton);

    expect(toggleFavorite).toHaveBeenCalledWith(1);
  });
});