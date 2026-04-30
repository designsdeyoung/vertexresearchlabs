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
    <div className="relative z-[60] w-full border-b border-amber-800/30 bg-amber-950/40 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-center gap-3 px-6 py-2 text-center">
        <p className="text-[13px] leading-snug text-amber-300">
          All products are research materials for laboratory and analytical use only.
          Not for human consumption. For licensed researchers only.
        </p>
        <button
          type="button"
          aria-label="Dismiss compliance notice"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "1");
            setVisible(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400/70 transition-colors hover:text-amber-200"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default ComplianceBanner;
