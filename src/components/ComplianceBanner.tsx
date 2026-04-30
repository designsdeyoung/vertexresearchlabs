import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "vrl_compliance_banner_dismissed_v1";

const ComplianceBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] w-full border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-center gap-2 px-6 py-1.5 text-center">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/80" aria-hidden />
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Research Use Only
          <span className="mx-2 text-border">·</span>
          Not for human or veterinary use
        </p>
        <button
          type="button"
          aria-label="Dismiss notice"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "1");
            setVisible(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};

export default ComplianceBanner;
