import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, ShoppingBag, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useCart } from "../context/CartContext";
import type { SampleProduct } from "../context/CartContext";
import { useSubmitInquiry } from "../hooks/useQueries";

interface Props {
  product: Product | SampleProduct | null;
  onClose: () => void;
}

function getImageSrc(product: Product | SampleProduct): string | null {
  if ("isSample" in product && product.isSample) {
    return (product as SampleProduct).imageUrl || null;
  }
  const p = product as Product;
  return p.imageId ? p.imageId.getDirectURL() : null;
}

export default function ProductDetailModal({ product, onClose }: Props) {
  const { addItem } = useCart();
  const submitInquiry = useSubmitInquiry();
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInquiry = async () => {
    if (!product) return;
    try {
      await submitInquiry.mutateAsync({
        name: inquiryForm.name,
        email: inquiryForm.email,
        productId: product.id,
        message: inquiryForm.message,
      });
      toast.success("Inquiry sent! We'll get back to you soon.");
      setShowInquiry(false);
      setInquiryForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send inquiry. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[800px] md:max-h-[85vh] bg-background rounded-lg z-50 overflow-y-auto shadow-2xl"
            aria-label={`Product detail: ${product.name}`}
            data-ocid="product.modal"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-sm z-10 transition-colors"
              data-ocid="product.close_button"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="md:flex">
              {/* Image */}
              <div className="md:w-1/2 bg-secondary">
                {getImageSrc(product) ? (
                  <img
                    src={getImageSrc(product)!}
                    alt={product.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-64 md:h-full flex items-center justify-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  {product.category}
                </p>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
                  {product.name}
                </h2>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${s <= 4 ? "fill-accent text-accent" : "text-border"}`}
                    />
                  ))}
                </div>
                <p className="text-2xl font-bold text-foreground mb-4">
                  ${(Number(product.price) / 100).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {product.description}
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  {Number(product.stock) > 0
                    ? `${Number(product.stock)} in stock`
                    : "Out of stock"}
                </p>

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm uppercase tracking-widest text-xs h-11 mb-3"
                  onClick={() => {
                    addItem(product);
                    onClose();
                  }}
                  disabled={Number(product.stock) === 0}
                  data-ocid="product.primary_button"
                >
                  {Number(product.stock) === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowInquiry((v) => !v)}
                >
                  <MessageCircle className="h-4 w-4" />
                  Send an Inquiry
                </button>

                {showInquiry && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 space-y-3 border-t border-border pt-4"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs mb-1 block">Your Name</Label>
                        <Input
                          value={inquiryForm.name}
                          onChange={(e) =>
                            setInquiryForm((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Jane Doe"
                          className="h-9 text-sm"
                          data-ocid="inquiry.input"
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Email</Label>
                        <Input
                          type="email"
                          value={inquiryForm.email}
                          onChange={(e) =>
                            setInquiryForm((p) => ({
                              ...p,
                              email: e.target.value,
                            }))
                          }
                          placeholder="jane@email.com"
                          className="h-9 text-sm"
                          data-ocid="inquiry.input"
                        />
                      </div>
                    </div>
                    <Textarea
                      value={inquiryForm.message}
                      onChange={(e) =>
                        setInquiryForm((p) => ({
                          ...p,
                          message: e.target.value,
                        }))
                      }
                      placeholder="Tell us what you'd like to know..."
                      rows={3}
                      className="text-sm"
                      data-ocid="inquiry.textarea"
                    />
                    <Button
                      size="sm"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm text-xs uppercase tracking-wider"
                      onClick={handleInquiry}
                      disabled={submitInquiry.isPending}
                      data-ocid="inquiry.submit_button"
                    >
                      {submitInquiry.isPending ? "Sending..." : "Send Inquiry"}
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
