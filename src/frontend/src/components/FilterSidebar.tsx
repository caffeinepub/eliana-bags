import { cn } from "@/lib/utils";
import { CATEGORIES } from "../data/sampleProducts";

interface FilterSidebarProps {
  selected: string;
  onSelect: (cat: string) => void;
}

export default function FilterSidebar({
  selected,
  onSelect,
}: FilterSidebarProps) {
  return (
    <aside className="w-full" aria-label="Product filters">
      <div className="mb-6">
        <h2 className="text-xs uppercase tracking-widest font-semibold text-foreground mb-4">
          Filter
        </h2>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => onSelect(cat)}
              className={cn(
                "w-full text-left text-sm px-3 py-2 rounded-sm transition-colors",
                selected === cat
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-foreground/70 hover:text-foreground hover:bg-secondary",
              )}
              data-ocid="products.tab"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h2 className="text-xs uppercase tracking-widest font-semibold text-foreground mb-4">
          Sort
        </h2>
        <div className="space-y-1">
          {[
            "Featured",
            "Price: Low to High",
            "Price: High to Low",
            "Newest",
          ].map((opt) => (
            <button
              type="button"
              key={opt}
              className="w-full text-left text-sm px-3 py-2 text-foreground/70 hover:text-foreground hover:bg-secondary rounded-sm transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
