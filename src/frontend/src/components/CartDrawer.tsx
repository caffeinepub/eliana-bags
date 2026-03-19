import { Button } from "@/components/ui/button";
import { CheckCircle, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Product } from "../backend.d";
import type { SampleProduct } from "../context/CartContext";
import { useCart } from "../context/CartContext";

function getCartItemImage(
  product: Product | SampleProduct,
): string | undefined {
  if ("isSample" in product && product.isSample) {
    return (product as SampleProduct).imageUrl;
  }
  const p = product as Product;
  return p.imageId?.getDirectURL();
}

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    total,
    clearCart,
  } = useCart();
  const [confirmed, setConfirmed] = useState(false);

  const handleCheckout = () => {
    setConfirmed(true);
    clearCart();
    setTimeout(() => {
      setConfirmed(false);
      setIsOpen(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setIsOpen(false)}
            data-ocid="cart.modal"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 flex flex-col shadow-2xl"
            aria-label="Shopping cart"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="font-serif text-lg tracking-wide">Your Cart</h2>
                <span className="text-sm text-muted-foreground">
                  ({items.length} items)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-secondary rounded-sm transition-colors"
                aria-label="Close cart"
                data-ocid="cart.close_button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {confirmed ? (
                <div
                  className="flex flex-col items-center justify-center h-full gap-4"
                  data-ocid="cart.success_state"
                >
                  <CheckCircle className="h-14 w-14 text-green-600" />
                  <p className="font-serif text-xl">Order Confirmed!</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Thank you for your order. We'll be in touch soon.
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-full gap-3"
                  data-ocid="cart.empty_state"
                >
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, idx) => {
                    const imgSrc = getCartItemImage(item.product);
                    return (
                      <div
                        key={item.product.id}
                        className="flex gap-4 border-b border-border pb-4"
                        data-ocid={`cart.item.${idx + 1}`}
                      >
                        <div className="w-20 h-20 bg-secondary rounded-md overflow-hidden flex-shrink-0">
                          {imgSrc && (
                            <img
                              src={imgSrc}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.product.category}
                          </p>
                          <p className="text-sm font-bold mt-1">
                            ${(Number(item.product.price) / 100).toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              className="w-6 h-6 rounded-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              className="w-6 h-6 rounded-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors"
                              data-ocid={`cart.delete_button.${idx + 1}`}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {!confirmed && items.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-bold text-lg">
                    ${(total / 100).toFixed(2)}
                  </span>
                </div>
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm uppercase tracking-widest text-xs h-12"
                  onClick={handleCheckout}
                  data-ocid="cart.confirm_button"
                >
                  Checkout
                </Button>
                <button
                  type="button"
                  className="w-full text-xs text-muted-foreground underline"
                  onClick={() => setIsOpen(false)}
                  data-ocid="cart.cancel_button"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
