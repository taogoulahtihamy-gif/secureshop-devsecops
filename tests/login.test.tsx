import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Home from "@/app/page";
import { ShopProvider } from "@/context/ShopContext";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
    push: vi.fn(),
  }),
}));

describe("Authentification SecureShop", () => {
  beforeEach(() => {
    replace.mockClear();
  });

  it("affiche le formulaire de connexion", async () => {
    render(
      <ShopProvider>
        <Home />
      </ShopProvider>,
    );

    expect(
      screen.getByRole("heading", { name: /connectez-vous/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/nom d’utilisateur/i),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^mot de passe$/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /se connecter/i }),
    ).toBeInTheDocument();
  });

  it("se connecte avec /auth/login", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.includes("/auth/login")) {
          return {
            ok: true,
            json: async () => ({
              token: "secure-token-test",
            }),
          } as Response;
        }

        if (url.includes("/products")) {
          return {
            ok: true,
            json: async () => [],
          } as Response;
        }

        throw new Error(`URL inattendue : ${url}`);
      }),
    );

    render(
      <ShopProvider>
        <Home />
      </ShopProvider>,
    );

    await user.clear(screen.getByLabelText(/nom d’utilisateur/i));
    await user.type(
      screen.getByLabelText(/nom d’utilisateur/i),
      "mor_2314",
    );

    await user.clear(screen.getByLabelText(/^mot de passe$/i));
    await user.type(
      screen.getByLabelText(/^mot de passe$/i),
      "83r5^_",
    );

    await user.click(
      screen.getByRole("button", { name: /se connecter/i }),
    );

    await waitFor(() => {
    expect(localStorage.getItem("secureshop-token")).toBe(
  "secure-token-test",
);
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("affiche une erreur si la connexion échoue", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
      })),
    );

    render(
      <ShopProvider>
        <Home />
      </ShopProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: /se connecter/i }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(/connexion refusée/i);
  });
});