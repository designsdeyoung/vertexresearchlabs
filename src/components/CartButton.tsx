import { useInquiryCart } from "@/contexts/InquiryCartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const CartButton = () => {
  const { itemCount, toggleCart } = useInquiryCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={toggleCart}
      aria-label="Open inquiry cart"
    >
      <ShoppingCart size={20} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Button>
  );
};

export default CartButton;
