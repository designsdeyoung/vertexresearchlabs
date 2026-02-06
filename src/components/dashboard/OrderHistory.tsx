import { Package, Sparkles } from "lucide-react";

interface Order {
  id: string;
  order_number: string | null;
  items: any;
  subtotal: number;
  total: number;
  points_earned: number;
  status: string;
  created_at: string;
}

interface OrderHistoryProps {
  orders: Order[];
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  confirmed: "bg-primary/10 text-primary",
  shipped: "bg-blue-500/10 text-blue-500",
  delivered: "bg-green-500/10 text-green-500",
};

const OrderHistory = ({ orders }: OrderHistoryProps) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Package size={16} className="text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">Order History</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Package size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No orders yet</p>
          <p className="text-xs mt-1">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-3 rounded-lg bg-secondary/20 border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-mono">
                  {order.id.slice(0, 8)}
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${
                    statusColors[order.status] || "bg-secondary text-muted-foreground"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {formatPrice(order.total)}
                </span>
                {order.points_earned > 0 && (
                  <span className="text-xs text-primary flex items-center gap-1">
                    <Sparkles size={10} />
                    +{order.points_earned} pts
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
