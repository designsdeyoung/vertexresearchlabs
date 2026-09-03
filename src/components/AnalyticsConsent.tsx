import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "vrl_analytics_consent_v1";
const MEASUREMENT_ID = "G-YY1Q0F0ZCQ";

type Consent = "granted" | "denied" | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const enableAnalytics = () => {
  if (document.querySelector(`script[data-vrl-analytics="${MEASUREMENT_ID}"]`)) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, { anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  script.dataset.vrlAnalytics = MEASUREMENT_ID;
  document.head.appendChild(script);
};

const AnalyticsConsent = () => {
  const [consent, setConsent] = useState<Consent>(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      return stored === "granted" || stored === "denied" ? stored : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (consent === "granted") enableAnalytics();
  }, [consent]);

  const choose = (choice: Exclude<Consent, null>) => {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // Retain the choice in memory if storage is unavailable.
    }
    setConsent(choice);
  };

  if (consent) return null;

  return (
    <aside
      aria-label="Analytics choice"
      className="fixed bottom-4 left-4 right-4 z-[80] mx-auto max-w-2xl rounded-xl border border-border bg-popover p-4 shadow-2xl"
    >
      <p className="text-sm leading-relaxed text-foreground">
        May we use Google Analytics to understand aggregate site usage? It is off unless you
        choose “Allow analytics.” See our <Link className="text-primary underline" to="/privacy">Privacy Policy</Link>.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => choose("granted")}>Allow analytics</Button>
        <Button size="sm" variant="outline" onClick={() => choose("denied")}>Decline</Button>
      </div>
    </aside>
  );
};

export default AnalyticsConsent;
