import { Product } from "@/lib/shop";

export default function ProductRating({ rating }: { rating: Product["rating"] }) {
  const rounded = Math.round(rating.rate);
  return (
    <div className="product-rating" aria-label={`${rating.rate} étoiles sur 5, ${rating.count} avis`}>
      <span aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <svg className={index < rounded ? "star-filled" : ""} viewBox="0 0 24 24" key={index}>
            <path d="m12 2.8 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9L6.4 20l1.1-6.2L3 9.4l6.2-.9L12 2.8Z" />
          </svg>
        ))}
      </span>
      <strong>{rating.rate.toFixed(1)}</strong><small>({rating.count} avis)</small>
    </div>
  );
}
