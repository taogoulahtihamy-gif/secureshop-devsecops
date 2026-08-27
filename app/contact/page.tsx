"use client";

import { FormEvent, useState } from "react";
import StorePage from "@/components/StorePage";

export default function ContactPage() {
  const [success, setSuccess] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("Votre message a bien été enregistré. Merci de nous avoir contactés.");
    event.currentTarget.reset();
  };
  return (
    <StorePage>
      <section className="route-page contact-page">
        <div className="contact-copy"><p className="eyebrow">CONTACT</p><h1>Parlons de votre expérience.</h1><p>Une question ou une suggestion ? Envoyez-nous un message, notre équipe est à votre écoute.</p></div>
        <form className="contact-form" onSubmit={submit}>
          <label>Nom<input name="name" autoComplete="name" required /></label>
          <label>Adresse e-mail<input name="email" type="email" autoComplete="email" required /></label>
          <label className="contact-message-field">Sujet<input name="subject" minLength={3} required /></label>
          <label className="contact-message-field">Message<textarea name="message" rows={6} minLength={10} required /></label>
          {success && <p className="contact-notice" role="status">{success}</p>}
          <button className="primary-button" type="submit">Envoyer le message</button>
        </form>
      </section>
    </StorePage>
  );
}
