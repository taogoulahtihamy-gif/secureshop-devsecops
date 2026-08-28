import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import StoreHeader from "@/components/StoreHeader";

const replace = vi.fn();
const logout = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/accueil",
  useRouter: () => ({ replace }),
}));

vi.mock("@/context/ShopContext", () => ({
  useShop: () => ({ cartCount: 0, favoriteCount: 0, logout }),
}));

describe("Navigation SecureShop", () => {
  it("déconnecte l’utilisateur puis navigue vers la route de connexion existante", async () => {
    const user = userEvent.setup();
    render(<StoreHeader />);

    await user.click(screen.getByRole("button", { name: /déconnexion/i }));

    expect(logout).toHaveBeenCalledOnce();
    expect(replace).toHaveBeenCalledWith("/");
  });
});
