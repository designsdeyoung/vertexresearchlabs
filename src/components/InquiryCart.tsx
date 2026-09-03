import { useNavigate } from "react-router-dom";
import { useInquiryCart, lineKey } from "@/contexts/InquiryCartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, FlaskConical, ShieldCheck, ArrowRight } from "lucide-react";
import { FLAT_RATE_SHIPPING } from "@/contexts/InquiryCartContext";

const InquiryCart = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    total,
    qualifiesForFreeShipping,
  } = useInquiryCart();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md bg-background border-border flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FlaskConical size={20} className="text-primary" />
            Research Materials
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <FlaskConical size={48} className="mx-auto mb-4 opacity-30" />
              <p>Your inquiry list is empty</p>
              <p className="text-sm mt-1">Add products to request research access</p>
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable region: notices, line items, and upsells all live here so
                they can never overlap. The totals/CTA below stay pinned. */}
            <div className="flex-1 min-h-0 overflow-y-auto mt-4 space-y-3 -mr-3 pr-3">
            {/* Research-use reminder */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 mt-3">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={16} className="text-primary" />
                <span className="text-xs font-medium text-primary">For laboratory research use only</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Not for human or veterinary use.
              </p>
            </div>

            <div className="space-y-3">
              {items.map(item => (
                <div
                  key={lineKey(item)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50"
                >
                  {item.product.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.product.size}
                    </p>
                    <p className="text-sm font-medium text-primary">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(lineKey(item), item.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:bg-secondary touch-manipulation select-none"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-7 text-center text-sm tabular-nums">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(lineKey(item), item.quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:bg-secondary touch-manipulation select-none"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeItem(lineKey(item))}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive active:bg-destructive/20 touch-manipulation select-none"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            </div>

            <div className="pt-4 border-t border-border/50 space-y-3 mt-4 shrink-0">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">US Shipping</span>
                {qualifiesForFreeShipping ? (
                  <span className="text-primary font-medium">No charge</span>
                ) : (
                  <span className="text-foreground font-medium">{formatPrice(FLAT_RATE_SHIPPING)}</span>
                )}
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-border/30">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-semibold text-foreground text-lg">{formatPrice(total)}</span>
              </div>
              <Button variant="hero" className="w-full" onClick={handleProceedToCheckout}>
                Continue to Qualification
                <ArrowRight size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={clearCart}>
                Clear All
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default InquiryCart;
