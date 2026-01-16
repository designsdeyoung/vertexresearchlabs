import { Truck } from "lucide-react";

const FreeShippingBanner = () => {
  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium">
      <div className="container flex items-center justify-center gap-2">
        <Truck className="h-4 w-4" />
        <span>Free US Shipping on Orders Over $99</span>
      </div>
    </div>
  );
};

export default FreeShippingBanner;
