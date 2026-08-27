import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BoutiquePage from "@/app/boutique/page";

const products = [
  {
    id: 1,
    title: "Sac Alpha",
    price: 100,
    category: "men's clothing",
    description: "Produit 1",
    image: "alpha.jpg",
    rating: { rate: 4.5, count: 10 },
  },
  {
    id: 2,
    title: "Téléphone Beta",
    price: 300,
    category: "electronics",
    description: "Produit 2",
    image: "beta.jpg",
    rating: { rate: 4.2, count: 20 },
  },
  {
    id: 3,
    title: "Bijou Gamma",
    price: 150,
    category: "jewelery",
    description: "Produit 3",
    image: "gamma.jpg",
    rating: { rate: 4.8, count: 30 },
  },
];

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: () => null,
  }),
}));

vi.mock("@/context/ShopContext", () => ({
  useShop: () => ({
    products,
    loading: false,
    error: "",
  }),
}));

vi.mock("@/components/StorePage", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/ProductCard", () => ({
  default: ({ product }: { product: (typeof products)[number] }) => (
    <article data-testid={`product-${product.id}`}>
      {product.title}
    </article>
  ),
}));

vi.mock("@/components/ProductModal", () => ({
  default: () => null,
}));

vi.mock("@/lib/shop", () => ({
  cfa: (price: number) => `${price} F CFA`,
  translateCategory: (category: string) => category,
  translatedTitle: (product: { title: string }) => product.title,
}));

describe("Boutique SecureShop", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche le catalogue de produits", () => {
    render(<BoutiquePage />);

    expect(screen.getByText("Sac Alpha")).toBeInTheDocument();
    expect(screen.getByText("Téléphone Beta")).toBeInTheDocument();
    expect(screen.getByText("Bijou Gamma")).toBeInTheDocument();

    expect(screen.getByText("3 produits")).toBeInTheDocument();
  });

  it("recherche un produit", async () => {
    const user = userEvent.setup();

    render(<BoutiquePage />);

    const search = screen.getByRole("textbox", {
      name: /rechercher un produit/i,
    });

    await user.type(search, "Téléphone");

    expect(screen.getByText("Téléphone Beta")).toBeInTheDocument();
    expect(screen.queryByText("Sac Alpha")).not.toBeInTheDocument();
    expect(screen.queryByText("Bijou Gamma")).not.toBeInTheDocument();

    expect(screen.getByText("1 produits")).toBeInTheDocument();
  });

  it("filtre les produits par catégorie", async () => {
    const user = userEvent.setup();

    render(<BoutiquePage />);

    const electronicsButtons = screen.getAllByRole("button", {
      name: "electronics",
    });

    await user.click(electronicsButtons[0]);

    expect(screen.getByText("Téléphone Beta")).toBeInTheDocument();

    expect(screen.queryByText("Sac Alpha")).not.toBeInTheDocument();
    expect(screen.queryByText("Bijou Gamma")).not.toBeInTheDocument();

    expect(screen.getByText("1 produits")).toBeInTheDocument();
  });
});