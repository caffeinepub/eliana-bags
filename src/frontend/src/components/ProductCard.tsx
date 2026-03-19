import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import type { Product } from "../backend.d";
import { useCart } from "../context/CartContext";
import type { SampleProduct } from "../context/CartContext";

interface ProductCardProps {
  product: Product | SampleProduct;
  index: number;
  onViewDetail: (product: Product | SampleProduct) => void;
}

function getImageSrc(product: Product | SampleProduct): string | null {
  if ("isSample" in product && product.isSample) {
    return (product as SampleProduct).imageUrl || null;
  }
  const p = product as Product;
  if (p.imageId) {
    return p.imageId.getDirectURL();
  }
  return null;
}

export default function ProductCard({
  product,
  index,
  onViewDetail,
}: ProductCardProps) {
  const { addItem } = useCart();
  const imageSrc = getImageSrc(product);
  const priceNum = Number(product.price);
  const priceDisplay = `$${(priceNum / 100).toFixed(2)}`;

  return (
    <article
      className="product-card-hover bg-card rounded-lg overflow-hidden border border-border flex flex-col"
      data-ocid={`products.item.${index}`}
    >
      {/* Image */}
      <button
        type="button"
        className="block relative overflow-hidden aspect-square bg-secondary"
        onClick={() => onViewDetail(product)}
        aria-label={`View ${product.name}`}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
      </button>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          {product.category}
        </p>
        <h3 className="font-serif text-base font-medium text-foreground mb-1 leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`h-3 w-3 ${s <= 4 ? "fill-accent text-accent" : "text-border"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
        </div>
        <p className="text-base font-bold text-foreground mb-3">
          {priceDisplay}
        </p>
        <Button
          className="mt-auto w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase tracking-wider rounded-sm h-9"
          onClick={() => addItem(product)}
          data-ocid={`products.primary_button.${index}`}
        >
          Add to Cart
        </Button>
      </div>
    </article>
  );
}
