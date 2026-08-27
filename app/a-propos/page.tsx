import Link from "next/link";
import StorePage from "@/components/StorePage";

const commitments = [
  {
    title: "Notre sélection",
    text: "Des articles choisis pour leur style, leur utilité et leur rapport qualité-prix.",
  },
  {
    title: "Notre engagement",
    text: "Une expérience claire, des prix transparents et un accompagnement à chaque étape.",
  },
  {
    title: "Votre satisfaction",
    text: "Nous plaçons la simplicité et la satisfaction de nos clients au cœur de SecureShop.",
  },
];

export default function AboutPage() {
  return (
    <StorePage>
      <section className="route-page about-page customer-about">
        <div className="route-heading">
          <p className="eyebrow">NOTRE HISTOIRE</p>
          <h1>Une nouvelle manière de faire vos achats</h1>
          <p>SecureShop sélectionne des produits utiles, modernes et accessibles pour accompagner votre quotidien. Notre objectif est de proposer une expérience d’achat simple, agréable et transparente.</p>
        </div>
        <div className="about-grid customer-values">
          {commitments.map((commitment) => (
            <article key={commitment.title}><h2>{commitment.title}</h2><p>{commitment.text}</p></article>
          ))}
        </div>
        <Link className="primary-link about-cta" href="/boutique">Découvrir nos produits</Link>
      </section>
    </StorePage>
  );
}
