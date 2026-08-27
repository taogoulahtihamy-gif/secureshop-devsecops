"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { API, Product } from "@/lib/shop";

type Cart = Record<number, number>;

type ShopContextValue = {
  token: string;
  ready: boolean;
  products: Product[];
  loading: boolean;
  error: string;
  cart: Cart;
  favorites: Set<number>;
  cartCount: number;
  favoriteCount: number;
  cartTotal: number;
  notice: string;
  setSession: (token: string, remember: boolean) => void;
  logout: () => void;
  addToCart: (id: number) => void;
  changeQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  toggleFavorite: (id: number) => void;
  clearNotice: () => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cart, setCart] = useState<Cart>({});
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("secureshop-token") ?? sessionStorage.getItem("secureshop-token") ?? "";
    let savedCart: Cart = {};
    let savedFavorites: number[] = [];
    try {
      savedCart = JSON.parse(localStorage.getItem("secureshop-cart") ?? "{}") as Cart;
      savedFavorites = JSON.parse(localStorage.getItem("secureshop-favorites") ?? "[]") as number[];
    } catch {
      localStorage.removeItem("secureshop-cart");
      localStorage.removeItem("secureshop-favorites");
    }
    queueMicrotask(() => {
      setCart(savedCart);
      setFavorites(new Set(savedFavorites));
      setToken(savedToken);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("secureshop-cart", JSON.stringify(cart));
    localStorage.setItem("secureshop-favorites", JSON.stringify([...favorites]));
  }, [cart, favorites, ready]);

  useEffect(() => {
    if (!token) {
      queueMicrotask(() => setProducts([]));
      return;
    }
    const controller = new AbortController();
    queueMicrotask(() => {
      setLoading(true);
      setError("");
    });
    fetch(`${API}/products`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Erreur de chargement");
        return response.json();
      })
      .then((data: Product[]) => setProducts(data))
      .catch((fetchError: Error) => {
        if (fetchError.name !== "AbortError") setError("Impossible de charger les produits. Réessayez dans un instant.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [token]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const setSession = (newToken: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem("secureshop-token", newToken);
      sessionStorage.removeItem("secureshop-token");
    } else {
      sessionStorage.setItem("secureshop-token", newToken);
      localStorage.removeItem("secureshop-token");
    }
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("secureshop-token");
    sessionStorage.removeItem("secureshop-token");
    setToken("");
    setCart({});
  };

  const changeQuantity = (id: number, delta: number) => setCart((current) => {
    const quantity = Math.max(0, (current[id] ?? 0) + delta);
    const updated = { ...current, [id]: quantity };
    if (!quantity) delete updated[id];
    return updated;
  });

  const addToCart = (id: number) => {
    changeQuantity(id, 1);
    setNotice("Produit ajouté au panier");
  };

  const removeFromCart = (id: number) => setCart((current) => {
    const updated = { ...current };
    delete updated[id];
    return updated;
  });

  const toggleFavorite = (id: number) => setFavorites((current) => {
    const updated = new Set(current);
    if (updated.has(id)) updated.delete(id); else updated.add(id);
    return updated;
  });

  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const cartTotal = products.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0);

  const value: ShopContextValue = {
    token, ready, products, loading, error, cart, favorites, cartCount,
    favoriteCount: favorites.size, cartTotal, notice, setSession, logout,
    addToCart, changeQuantity, removeFromCart, clearCart: () => setCart({}),
    toggleFavorite, clearNotice: () => setNotice(""),
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop doit être utilisé dans ShopProvider");
  return context;
}
