import { useNavigate } from "react-router-dom";
import { useInquiryCart, computeUnitPrice, lineKey } from "@/contexts/InquiryCartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, FlaskConical, ShieldCheck, ArrowRight, Truck, Sparkles, Package, Droplet, Plus as PlusIcon, Repeat } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD, FLAT_RATE_SHIPPING, THREE_PACK_DISCOUNT } from "@/contexts/InquiryCartContext";
import { calculatePointsForPrice } from "@/hooks/useRewards";
import { products } from "@/data/products";

const InquiryCart = () => {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeItem, 
    updateQuantity, 
    clearCart,
    addItem,
    add3Pack,
    subtotal,
    shippingCost,
    total,
    qualifiesForFreeShipping,
    amountToFreeShipping
  } = useInquiryCart();
  const navigate = useNavigate();

  // Upsell logic: if cart has any peptide but no BAC water, show upsell
  const hasPeptide = items.some(i => i.product.category !== "Diluent");
  const hasBacWater = items.some(i => i.product.id.startsWith("bac-water"));
  const showBacUpsell = hasPeptide && !hasBacWater;
  const bacWater3ml = products.find(p => p.id === "bac-water-3ml");
  const bacWater10ml = products.find(p => p.id === "bac-water-10ml");

  // 3-Pack upsell: items that are single (not 3-pack), not autoship, not diluent
  const threePackCandidates = items.filter(
    (i) => !i.is3Pack && !i.isAutoship && i.product.category !== "Diluent" && !i.product.outOfStock
  );

  const handleProceedToAccess = () => {
    closeCart();
    navigate("/research-access");
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
            {/* Free Shipping Progress */}
            <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Truck size={16} className={qualifiesForFreeShipping ? "text-primary" : "text-muted-foreground"} />
                {qualifiesForFreeShipping ? (
                  <span className="text-sm font-medium text-primary">Free US Shipping Unlocked!</span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Add {formatPrice(amountToFreeShipping)} more for free US shipping
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Research Access Notice */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 mt-3">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={16} className="text-primary" />
                <span className="text-xs font-medium text-primary">Research Access Required</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Complete compliance acknowledgment to proceed with your order.
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
                      {item.is3Pack && (
                        <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] text-primary font-medium">
                          <Package size={10} /> 3-Pack
                        </span>
                      )}
                      {item.isAutoship && (
                        <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] text-primary font-medium">
                          <Repeat size={10} /> Autoship
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.product.size}
                      {item.isAutoship && (
                        <span className="text-primary/70">
                          {" "}• every {item.intervalDays ?? (item.is3Pack ? 90 : 30)} days
                        </span>
                      )}
                    </p>
                    {item.is3Pack || item.isAutoship ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground line-through">{formatPrice(item.product.price)}</span>
                        <span className="text-sm font-medium text-primary">{formatPrice(computeUnitPrice(item))}</span>
                        <span className="text-[10px] text-primary/70">ea</span>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-primary">{formatPrice(item.product.price)}</p>
                    )}
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

            {/* 3-Pack Upsell */}
            {threePackCandidates.length > 0 && (
              <div className="mt-3 space-y-2">
                {threePackCandidates.map((item) => {
                  const single = item.product.price;
                  const threePackTotal = single * 3 * (1 - THREE_PACK_DISCOUNT);
                  const savings = single * 3 - threePackTotal;
                  return (
                    <div
                      key={`3pack-upsell-${item.product.id}`}
                      className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Package size={16} className="text-primary mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            Upgrade {item.product.name} to a 3-Pack
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Save {formatPrice(savings)} ({Math.round(THREE_PACK_DISCOUNT * 100)}% off · {formatPrice(threePackTotal / 3)} ea)
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => add3Pack(item.product)}
                        className="w-full flex items-center justify-center gap-1.5 p-2 rounded-md bg-primary/15 hover:bg-primary/25 border border-primary/40 hover:border-primary text-primary text-xs font-medium transition-all"
                      >
                        <PlusIcon size={14} />
                        Add 3-Pack — {formatPrice(threePackTotal)}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* BAC Water Upsell */}
            {showBacUpsell && bacWater3ml && bacWater10ml && (
              <div className="mt-3 p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30">
                <div className="flex items-start gap-2 mb-2">
                  <Droplet size={16} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Don't forget BAC Water</p>
                    <p className="text-xs text-muted-foreground">Required diluent for peptide reconstitution.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => addItem(bacWater3ml)}
                    className="flex items-center justify-between gap-1 p-2 rounded-md bg-background/50 border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-xs font-medium text-foreground">3mL</p>
                      <p className="text-xs text-primary font-semibold">{formatPrice(bacWater3ml.price)}</p>
                    </div>
                    <PlusIcon size={14} className="text-muted-foreground group-hover:text-primary" />
                  </button>
                  <button
                    onClick={() => addItem(bacWater10ml)}
                    className="flex items-center justify-between gap-1 p-2 rounded-md bg-background/50 border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-xs font-medium text-foreground">10mL</p>
                      <p className="text-xs text-primary font-semibold">{formatPrice(bacWater10ml.price)}</p>
                    </div>
                    <PlusIcon size={14} className="text-muted-foreground group-hover:text-primary" />
                  </button>
                </div>
              </div>
            )}
            </div>

            <div className="pt-4 border-t border-border/50 space-y-3 mt-4 shrink-0">
              {/* Points earned preview */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Sparkles size={12} className="text-primary" />
                  Points you'll earn
                </span>
                <span className="text-primary font-medium">
                  +{calculatePointsForPrice(subtotal)} pts
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">US Shipping</span>
                {qualifiesForFreeShipping ? (
                  <span className="text-primary font-medium">FREE</span>
                ) : (
                  <span className="text-foreground font-medium">{formatPrice(FLAT_RATE_SHIPPING)}</span>
                )}
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-border/30">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-semibold text-foreground text-lg">{formatPrice(total)}</span>
              </div>
              <Button variant="hero" className="w-full" onClick={handleProceedToAccess}>
                <ShieldCheck size={16} />
                Proceed to Research Access
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
