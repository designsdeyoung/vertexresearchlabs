import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useCompliance } from "@/contexts/ComplianceContext";
import { subscribeEmail } from "@/lib/resend";

const COOKIE = "vrl_popup_seen";
const COOKIE_DAYS = 30;
const SHOW_DELAY_MS = 8000;

const hasCookie = () =>
  typeof document !== "undefined" && document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=`));

const setCookie = () => {
  document.cookie = `${COOKIE}=1; max-age=${COOKIE_DAYS * 24 * 60 * 60}; path=/; SameSite=Lax`;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailCapturePopup = () => {
  // Only render at all if the cookie isn't already set (checked once on mount).
  const [eligible] = useState(() => !hasCookie());
  const { hasAcknowledged } = useCompliance();

  const [mounted, setMounted] = useState(false); // in DOM
  const [visible, setVisible] = useState(false); // transition target
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const openedRef = useRef(false);

  // Trigger on 8s delay + exit-intent — but only after the research disclaimer
  // has been acknowledged, so we never stack on top of that modal.
  useEffect(() => {
    if (!eligible || !hasAcknowledged) return;

    const open = () => {
      if (openedRef.current) return;
      openedRef.current = true;
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    };

    const timer = window.setTimeout(open, SHOW_DELAY_MS);

    const onMouseOut = (e: MouseEvent) => {
      // Exit-intent: cursor leaves through the top of the viewport (desktop only).
      if (e.clientY <= 0 && window.innerWidth >= 768) open();
    };
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [eligible, hasAcknowledged]);

  const dismiss = () => {
    setCookie();
    setVisible(false);
    window.setTimeout(() => setMounted(false), 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    const { error } = await subscribeEmail(email.trim(), { sendWelcome: true, source: "exit-popup" });
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setCookie(); // don't show again once subscribed
  };

  if (!eligible || !mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Email signup"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={dismiss} />

      {/* Card */}
      <div
        className={`relative w-full max-w-md rounded-xl border border-border bg-card p-7 shadow-2xl transition-all duration-200 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 text-muted-foreground/60 transition-colors hover:text-foreground"
        >
          <X size={18} />
        </button>

        {status === "success" ? (
          <div className="py-4 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">Check your inbox</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              You're subscribed. Welcome to the lab.
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="mt-6 text-sm text-primary hover:underline"
            >
              Continue browsing
            </button>
          </div>
        ) : (
          <>
            <span className="inline-block rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              Research Updates
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
              Stay informed on new reference materials
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Join our research community. Get catalog updates, new lot availability, and
              documentation updates delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3" noValidate>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="your@email.com"
                autoComplete="email"
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50"
              />
              {status === "error" && (
                <p className="text-xs text-destructive">Something went wrong — please try again.</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Sending…" : "Subscribe"}
              </button>
            </form>

            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground/70">
              For verified research use only. Unsubscribe anytime. We never sell your data.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailCapturePopup;
