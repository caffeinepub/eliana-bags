import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import type { Product } from "../backend.d";
import FilterSidebar from "../components/FilterSidebar";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import ProductDetailModal from "../components/ProductDetailModal";
import type { SampleProduct } from "../context/CartContext";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";
import { useGetAllActiveProducts } from "../hooks/useQueries";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

export default function StorefrontPage() {
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<
    Product | SampleProduct | null
  >(null);
  const shopRef = useRef<HTMLDivElement>(null);

  const { data: backendProducts, isLoading } = useGetAllActiveProducts();

  // Use backend products if available, fallback to samples
  const allProducts: (Product | SampleProduct)[] =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : SAMPLE_PRODUCTS;

  const filtered =
    category === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === category);

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <HeroSection onShopClick={scrollToShop} />

      {/* Shop Section */}
      <div
        ref={shopRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        id="shop"
      >
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Our Collection
          </p>
          <h2 className="font-serif text-3xl text-foreground">Shop All Bags</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-48 lg:w-56 shrink-0">
            <FilterSidebar selected={category} onSelect={setCategory} />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {SKELETON_KEYS.map((key) => (
                  <div key={key} className="space-y-3">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-20 gap-3"
                data-ocid="products.empty_state"
              >
                <p className="text-muted-foreground text-sm">
                  No products in this category yet.
                </p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              >
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                  >
                    <ProductCard
                      product={product}
                      index={i + 1}
                      onViewDetail={setSelectedProduct}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
