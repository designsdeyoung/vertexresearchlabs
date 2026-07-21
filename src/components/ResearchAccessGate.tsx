import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCompliance } from "@/contexts/ComplianceContext";
import { ArrowRight, FlaskConical, ShieldCheck, FileText, Microscope } from "lucide-react";
import logoFull from "@/assets/logo-full.png";

interface ResearchAccessGateProps {
  /** Called after the visitor completes the acknowledgment. Use it to route
   *  onward; when used as a route guard, a no-op is fine — the context state
   *  change re-renders the protected content. */
  onComplete?: () => void;
  /** Optional heading override (e.g. "Continue to Checkout" flows). */
  continueLabel?: string;
}

const assurances = [
  { icon: Microscope, text: "For laboratory & analytical research use only" },
  { icon: ShieldCheck, text: "Not for human or veterinary use" },
  { icon: FileText, text: "Certificates of Analysis available on request" },
];

/**
 * Full-page research-access gate. Visitors must confirm eligibility and accept
 * the research-use terms before entering the catalog. The acknowledgment is
 * persisted per device by ComplianceContext, so this is a one-time step.
 */
const ResearchAccessGate = ({ onComplete, continueLabel = "Enter the Catalog" }: ResearchAccessGateProps) => {
  const { setAcknowledgments, setEligibilityType, completeAcknowledgment } = useCompliance();

  const [isOfAge, setIsOfAge] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [researchUse, setResearchUse] = useState(false);

  const canProceed = isOfAge && agreedToTerms && researchUse;

  const handleProceed = () => {
    if (!canProceed) return;
    setAcknowledgments({
      researchUseOnly: true,
      notForMedicalUse: true,
      termsAccepted: true,
    });
    setEligibilityType("individual");
    completeAcknowledgment();
    onComplete?.();
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-lab-grid opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(700px 340px at 50% -5%, hsl(172 66% 50% / 0.12), transparent 65%)",
        }}
      />

      <section
        aria-labelledby="gate-title"
        className="glass-panel relative z-10 w-full max-w-lg rounded-3xl p-7 sm:p-10"
      >
        <div className="flex flex-col items-center text-center">
          <img src={logoFull} alt="Vertex Research Labs" className="mb-6 h-11 w-auto" />
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            <FlaskConical size={12} />
            Research Access
          </span>
          <h1 id="gate-title" className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
            Confirm research eligibility
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Vertex Research Labs supplies analytical reference materials for
            laboratory research. Please confirm the following to enter the catalog.
          </p>
        </div>

        {/* Assurances */}
        <ul className="mt-7 grid gap-2">
          {assurances.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3 text-sm text-muted-foreground"
            >
              <Icon size={16} className="shrink-0 text-primary" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>

        {/* Acknowledgments */}
        <fieldset className="mt-6 space-y-3">
          <legend className="sr-only">Required acknowledgments</legend>

          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
              isOfAge ? "border-primary/60 bg-primary/5" : "border-border hover:border-muted-foreground/50"
            }`}
          >
            <Checkbox checked={isOfAge} onCheckedChange={(c) => setIsOfAge(c === true)} />
            <span className="text-sm text-foreground">
              I am <span className="font-medium">21 years of age or older</span>.
            </span>
          </label>

          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
              researchUse ? "border-primary/60 bg-primary/5" : "border-border hover:border-muted-foreground/50"
            }`}
          >
            <Checkbox
              checked={researchUse}
              onCheckedChange={(c) => setResearchUse(c === true)}
              className="mt-0.5"
            />
            <span className="text-sm leading-relaxed text-foreground">
              I understand these materials are for{" "}
              <span className="font-medium">laboratory research only</span> — not for
              human or veterinary use, diagnosis, or treatment.
            </span>
          </label>

          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
              agreedToTerms ? "border-primary/60 bg-primary/5" : "border-border hover:border-muted-foreground/50"
            }`}
          >
            <Checkbox
              checked={agreedToTerms}
              onCheckedChange={(c) => setAgreedToTerms(c === true)}
              className="mt-0.5"
            />
            <span className="text-sm leading-relaxed text-muted-foreground">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-primary underline-offset-2 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/disclaimer"
                className="text-primary underline-offset-2 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Disclaimer
              </Link>
              .
            </span>
          </label>
        </fieldset>

        <Button
          variant="hero"
          size="xl"
          className="mt-6 w-full"
          disabled={!canProceed}
          onClick={handleProceed}
        >
          {continueLabel}
          <ArrowRight size={18} />
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground/60">
          By continuing you confirm the statements above are accurate.
        </p>
      </section>
    </main>
  );
};

export default ResearchAccessGate;
