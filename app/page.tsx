"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { API } from "@/lib/shop";

type AuthDialog = "forgot" | "register" | "terms" | "privacy" | null;

export default function Home() {
  const router = useRouter();
  const { token, ready, setSession } = useShop();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [dialog, setDialog] = useState<AuthDialog>(null);
  const [registrationNotice, setRegistrationNotice] = useState("");

  useEffect(() => {
    if (ready && token) router.replace("/accueil");
  }, [ready, token, router]);

  useEffect(() => {
    if (!dialog) return;
    const overflow = document.body.style.overflow;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setDialog(null); };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", escape);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", escape); };
  }, [dialog]);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
      });
      if (!response.ok) throw new Error("Identifiants incorrects");
      const data = await response.json();
      setSession(data.token, rememberMe);
      router.replace("/accueil");
    } catch {
      setError("Connexion refusée. Vérifiez votre nom d’utilisateur et votre mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  const register = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get("password") !== form.get("confirm-password")) {
      setRegistrationNotice("Les mots de passe ne correspondent pas.");
      return;
    }
    setRegistrationNotice("Formulaire validé. Aucun compte distant n’a été créé : cette inscription est une démonstration.");
    event.currentTarget.reset();
  };

  return (
    <main className="login-page">
      <section className="login-intro">
        <span className="brand brand-light">SecureShop</span>
        <div className="login-message"><h1>Le shopping moderne,<br />livré en toute confiance.</h1><p>Une expérience e-commerce simple, rapide et soutenue par une chaîne de livraison sécurisée.</p></div>
        <p className="security-note">Achats sereins · Service attentif · Expérience fiable</p>
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={login}>
          <p className="eyebrow">BIENVENUE</p><h2>Connectez-vous</h2><p className="muted">Accédez au catalogue SecureShop.</p>
          <div className="login-field"><label htmlFor="username">Nom d’utilisateur</label><div className="input-shell"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" /></svg><input id="username" name="username" defaultValue="mor_2314" autoComplete="username" required /></div></div>
          <div className="login-field"><label htmlFor="password">Mot de passe</label><div className="input-shell has-action"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg><input id="password" name="password" type={showPassword ? "text" : "password"} defaultValue="83r5^_" autoComplete="current-password" required /><button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} aria-pressed={showPassword}><svg aria-hidden="true" viewBox="0 0 24 24">{showPassword ? <><path d="m3 3 18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 6 9 6a17.6 17.6 0 0 1-2.1 2.8M6.6 6.6C4.4 8.1 3 10 3 10s3.5 6 9 6c1 0 1.9-.2 2.7-.5" /></> : <><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" /><circle cx="12" cy="12" r="2.5" /></>}</svg></button></div></div>
          <div className="login-options"><label className="remember-option"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /><span>Se souvenir de moi</span></label><button className="text-button" type="button" onClick={() => setDialog("forgot")}>Mot de passe oublié ?</button></div>
          {error && <p className="alert" role="alert">{error}</p>}
          <button className="primary-button" type="submit" disabled={loading}>{loading ? "Connexion…" : "Se connecter"}</button>
          <div className="login-divider" aria-hidden="true"><span>ou</span></div>
          <button className="secondary-button" type="button" onClick={() => { setRegistrationNotice(""); setDialog("register"); }} disabled={loading}>Créer un compte</button>
          <p className="legal-note">En continuant, vous acceptez nos <button type="button" onClick={() => setDialog("terms")}>conditions d’utilisation</button> et notre <button type="button" onClick={() => setDialog("privacy")}>politique de confidentialité</button>.</p>
        </form>
      </section>

      {dialog && <div className="simple-modal-backdrop" onMouseDown={() => setDialog(null)}><section className="simple-modal auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-dialog-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setDialog(null)} aria-label="Fermer la fenêtre"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
        {dialog === "register" ? <><p className="eyebrow">INSCRIPTION</p><h2 id="auth-dialog-title">Créer un compte</h2><p className="dialog-intro">Renseignez vos informations pour découvrir le formulaire d’inscription.</p><form className="registration-form" onSubmit={register}><label>Nom<input name="name" autoComplete="name" required /></label><label>Nom d’utilisateur<input name="username" autoComplete="username" required /></label><label>Adresse e-mail<input name="email" type="email" autoComplete="email" required /></label><label>Mot de passe<input name="password" type="password" minLength={6} autoComplete="new-password" required /></label><label>Confirmation du mot de passe<input name="confirm-password" type="password" minLength={6} autoComplete="new-password" required /></label>{registrationNotice && <p className="auth-notice" role="status">{registrationNotice}</p>}<button className="primary-button" type="submit">Créer mon compte</button></form></> : <><p className="eyebrow">INFORMATION</p><h2 id="auth-dialog-title">{dialog === "forgot" ? "Mot de passe oublié" : dialog === "terms" ? "Conditions d’utilisation" : "Politique de confidentialité"}</h2><p className="dialog-intro">{dialog === "forgot" ? "La récupération du mot de passe n’est pas encore disponible. Notre équipe travaille à la rendre accessible prochainement." : dialog === "terms" ? "Les commandes passées sur cette version de SecureShop ne déclenchent aucun paiement réel." : "SecureShop conserve uniquement les informations nécessaires au fonctionnement de votre expérience dans votre navigateur."}</p><button className="primary-button" type="button" onClick={() => setDialog(null)}>J’ai compris</button></>}
      </section></div>}
    </main>
  );
}
