import { motion } from "framer-motion";
import { Package, Truck, MapPin, CheckCircle2, Clock, ExternalLink, Box } from "lucide-react";

export interface TrackData {
  found: boolean;
  order_number?: string;
  created_at?: string;
  items?: { name: string; size: string; quantity: number }[];
  status?: string;
  est_delivery_date?: string | null;
  tracking_number?: string;
  tracking_url?: string | null;
  delivered_at?: string | null;
  delivery_detail?: string | null;
  dest?: string;
  checkpoints?: { status: string; message: string; datetime: string; city: string | null; state: string | null }[];
}

const STAGES = [
  { key: "confirmed", label: "Order Confirmed", sub: "We've got your order", icon: CheckCircle2 },
  { key: "awaiting",  label: "Awaiting USPS",   sub: "Label created, ready for pickup", icon: Box },
  { key: "transit",   label: "In Transit",      sub: "On its way to you", icon: Truck },
  { key: "ofd",       label: "Out for Delivery", sub: "Arriving today", icon: MapPin },
  { key: "delivered", label: "Delivered",       sub: "Enjoy!", icon: Package },
];

// EasyPost status -> stage index
function stageFromStatus(status?: string): number {
  switch ((status || "").toLowerCase()) {
    case "delivered": return 4;
    case "out_for_delivery": return 3;
    case "in_transit": return 2;
    case "available_for_pickup": return 3;
    case "pre_transit":
    case "unknown":
    case "shipped":
    case "":
      return 1;
    default: return 1;
  }
}

const fmtTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  } catch { return ""; }
};

export default function PackageTracker({ data }: { data: TrackData }) {
  const current = stageFromStatus(data.status);
  const pct = (current / (STAGES.length - 1)) * 100;
  const isDelivered = current >= 4;
  const headline = STAGES[current]?.label || "In Transit";
  const headlineSub = isDelivered
    ? (data.delivery_detail ? data.delivery_detail : "Your package has arrived")
    : STAGES[current]?.sub;

  return (
    <div className="relative">
      {/* Ambient glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-primary/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative glass-panel rounded-2xl overflow-hidden">
        {/* Top status band */}
        <div className="relative px-6 py-7 text-center border-b border-border/40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.07] to-transparent pointer-events-none" />
          <div className="relative">
            <p className="font-mono text-[11px] text-muted-foreground/70 mb-2">
              {data.order_number} {data.dest ? `· to ${data.dest}` : ""}
            </p>
            <motion.h2
              key={headline}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
            >
              {isDelivered ? "✅ " : ""}{headline}
            </motion.h2>
            <p className="text-sm text-muted-foreground mt-2">{headlineSub}</p>
            {!isDelivered && data.est_delivery_date && (
              <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Clock size={12} className="text-primary" />
                <span className="text-xs font-medium text-primary">
                  Est. delivery {new Date(data.est_delivery_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Animated stepper */}
        <div className="px-6 pt-8 pb-6">
          <div className="relative flex items-start justify-between">
            {/* base track */}
            <div className="absolute top-5 left-5 right-5 h-1 rounded-full bg-border/50" />
            {/* glowing fill */}
            <motion.div
              className="absolute top-5 left-5 h-1 rounded-full bg-gradient-to-r from-primary/70 via-primary to-primary"
              style={{ boxShadow: "0 0 12px hsl(var(--primary) / 0.7)" }}
              initial={{ width: 0 }}
              animate={{ width: `calc(${pct}% - ${pct === 0 ? 0 : 20}px)` }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
            {/* animated comet at the leading edge */}
            {!isDelivered && current > 0 && (
              <motion.div
                className="absolute top-[18px] w-2 h-2 rounded-full bg-primary"
                style={{ boxShadow: "0 0 14px 4px hsl(var(--primary) / 0.9)", left: `calc(${pct}% - 4px)` }}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {STAGES.map((stage, i) => {
              const Icon = stage.icon;
              const done = i < current;
              const active = i === current;
              return (
                <div key={stage.key} className="relative z-10 flex flex-col items-center gap-2.5 flex-1">
                  <motion.div
                    initial={false}
                    animate={active ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                    transition={active ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : {}}
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                      done    ? "bg-primary border-primary text-primary-foreground" :
                      active  ? "bg-primary/15 border-primary text-primary" :
                                "bg-background border-border/50 text-muted-foreground/30"
                    }`}
                    style={active ? { boxShadow: "0 0 0 6px hsl(var(--primary) / 0.12), 0 0 22px hsl(var(--primary) / 0.55)" } : {}}
                  >
                    {done ? <CheckCircle2 size={17} /> : <Icon size={16} />}
                    {active && (
                      <motion.span
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                  </motion.div>
                  <div className="text-center px-0.5">
                    <p className={`text-[10px] md:text-[11px] font-semibold leading-tight ${done || active ? "text-foreground" : "text-muted-foreground/40"}`}>
                      {stage.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tracking number + USPS link */}
        {data.tracking_number && (
          <div className="mx-6 mb-5 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15">
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">USPS Tracking</p>
              <p className="font-mono text-xs text-foreground truncate">{data.tracking_number}</p>
            </div>
            {data.tracking_url && (
              <a href={data.tracking_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline shrink-0 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                USPS.com <ExternalLink size={11} />
              </a>
            )}
          </div>
        )}

        {/* Scan history */}
        {data.checkpoints && data.checkpoints.length > 0 && (
          <div className="px-6 pb-6">
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-3">Tracking History</p>
            <div className="relative pl-5">
              <div className="absolute left-[5px] top-1 bottom-1 w-px bg-border/50" />
              {data.checkpoints.slice().reverse().map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative pb-3.5 last:pb-0"
                >
                  <div className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border-2 ${i === 0 ? "bg-primary border-primary" : "bg-background border-border"}`}
                    style={i === 0 ? { boxShadow: "0 0 10px hsl(var(--primary) / 0.7)" } : {}} />
                  <p className={`text-xs leading-snug ${i === 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {c.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                    {[c.city, c.state].filter(Boolean).join(", ")}{(c.city || c.state) && c.datetime ? " · " : ""}{c.datetime ? fmtTime(c.datetime) : ""}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Items footer */}
        {data.items && data.items.length > 0 && (
          <div className="px-6 py-4 border-t border-border/40">
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2.5">In This Box</p>
            <ul className="space-y-1.5">
              {data.items.map((it, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  {it.name}{it.size ? <span className="text-muted-foreground"> · {it.size}</span> : null}
                  {it.quantity > 1 ? <span className="text-muted-foreground"> × {it.quantity}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
