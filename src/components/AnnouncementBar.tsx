import { useState } from "react";
import { X, Wallet } from "lucide-react";

// Dismissible site-wide notice. Bump the COOKIE version to re-show after edits.
const KEY = "vrl_announce_payments_v1";

const AnnouncementBar = () => {
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
  });
  if (hidden) return null;

  const dismiss = () => {
    try { localStorage.setItem(KEY, "1"); } catch { /* noop */ }
    setHidden(true);
  };

  return (
    <div className="relative w-full bg-primary/10 border-b border-primary/20">
      <div className="container mx-auto px-6 py-2 pr-10">
        <p className="text-center text-[12px] sm:text-[13px] leading-relaxed text-foreground/90">
          <Wallet size={13} className="inline-block mr-1.5 -mt-0.5 text-primary" />
          <span className="font-medium text-foreground">Card checkout is temporarily unavailable</span>
          <span className="text-muted-foreground"> while we switch payment providers. </span>
          <span className="text-foreground/90">Orders are shipping as normal — pay easily by </span>
          <span className="font-semibold text-primary">Apple Cash or Zelle</span>
          <span className="text-foreground/90"> at checkout.</span>
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss notice"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors"
      >
        <X size={15} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
