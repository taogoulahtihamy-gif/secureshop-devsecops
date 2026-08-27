export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: { rate: number; count: number };
};

export const API = "https://fakestoreapi.com";

const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

export const cfa = (value: number) => money.format(value * 656);

const categoryLabels: Record<string, string> = {
  "men's clothing": "Mode homme",
  "women's clothing": "Mode femme",
  jewelery: "Bijoux",
  electronics: "Électronique",
};

export const translateCategory = (category: string) =>
  categoryLabels[category] ?? category;

export const productTranslations: Record<number, { title: string; description: string }> = {
  1: { title: "Sac à dos Fjällräven avec compartiment ordinateur", description: "Un sac à dos robuste au style intemporel, doté d’un compartiment rembourré pouvant accueillir un ordinateur portable jusqu’à 15 pouces." },
  2: { title: "T-shirt homme coupe ajustée", description: "Un t-shirt décontracté à manches courtes et col tunisien, confectionné dans une matière douce et légère pour un confort quotidien." },
  3: { title: "Veste homme en coton", description: "Une veste en coton idéale pour la mi-saison, avec une coupe confortable adaptée aux sorties, aux voyages et au quotidien." },
  4: { title: "T-shirt homme coupe slim décontractée", description: "Un haut léger et ajusté, agréable à porter seul ou sous une veste pour une tenue simple et moderne." },
  5: { title: "Bracelet dragon en argent et or", description: "Un bracelet inspiré du naga dragon, réalisé en argent avec des détails en or et une finition artisanale raffinée." },
  6: { title: "Bague fine pavée en or massif", description: "Une bague délicate au pavage lumineux, pensée pour être portée seule ou associée à d’autres bijoux." },
  7: { title: "Bague princesse plaquée or blanc", description: "Une bague élégante ornée d’une pierre taille princesse, avec un placage en or blanc pour une finition éclatante." },
  8: { title: "Boucles d’oreilles hibou en acier rose", description: "Des boucles d’oreilles originales en forme de hibou, mêlant acier inoxydable et détails aux tons or rose." },
  9: { title: "Disque dur externe WD 2 To", description: "Un disque dur portable USB 3.0 offrant 2 To de stockage pour sauvegarder et transporter facilement vos fichiers." },
  10: { title: "SSD interne SanDisk Plus 1 To", description: "Un disque SSD rapide et fiable qui améliore le démarrage, les transferts et la réactivité générale de votre ordinateur." },
  11: { title: "SSD Silicon Power 256 Go", description: "Un SSD compact offrant des démarrages rapides et de bonnes performances pour mettre à niveau un ordinateur portable ou de bureau." },
  12: { title: "Disque dur gaming WD 4 To pour PS4", description: "Un disque dur externe de 4 To conçu pour étendre simplement l’espace de stockage d’une console et conserver davantage de jeux." },
  13: { title: "Écran Acer SB220Q 21,5 pouces Full HD", description: "Un moniteur IPS Full HD fin et élégant, adapté au travail comme au divertissement grâce à une image nette et fluide." },
  14: { title: "Écran gaming incurvé Samsung 49 pouces", description: "Un écran ultra-large incurvé au format 32:9, offrant une expérience immersive et une grande surface d’affichage." },
  15: { title: "Veste femme trois-en-un avec capuche", description: "Une veste polyvalente avec doublure amovible et capuche réglable, idéale pour affronter les changements de météo." },
  16: { title: "Veste femme effet cuir à capuche", description: "Une veste motard élégante avec capuche amovible, poches fonctionnelles et coupe ajustée pour la mi-saison." },
  17: { title: "Imperméable femme coupe-vent", description: "Une veste de pluie légère et respirante avec capuche, facile à transporter pour les activités et déplacements en extérieur." },
  18: { title: "Haut femme manches courtes col bateau", description: "Un haut uni à la coupe fluide et au col bateau, confortable et facile à associer à toutes vos tenues." },
  19: { title: "T-shirt de sport femme respirant", description: "Un t-shirt léger qui évacue l’humidité, conçu pour offrir confort et liberté de mouvement pendant l’effort." },
  20: { title: "T-shirt femme décontracté en coton", description: "Un t-shirt doux à manches courtes avec imprimé graphique, parfait pour une tenue quotidienne décontractée." },
};

export const translatedTitle = (product: Product) =>
  productTranslations[product.id]?.title ?? product.title;

export const translatedDescription = (product: Product) =>
  productTranslations[product.id]?.description ?? product.description;
