import { ReactNode } from "react";
import { useCompliance } from "@/contexts/ComplianceContext";
import ResearchAccessGate from "@/components/ResearchAccessGate";

/**
 * Route guard for catalog & product pages. First-time visitors must complete
 * the research-access gate before the wrapped content renders. Once
 * acknowledged (persisted per device by ComplianceContext), the gate never
 * shows again and children render normally — no redirect, URL stays put.
 */
const RequireResearchAccess = ({ children }: { children: ReactNode }) => {
  const { hasAcknowledged } = useCompliance();

  if (!hasAcknowledged) {
    // No onComplete needed — flipping the context state re-renders and reveals
    // the wrapped route at the same URL.
    return <ResearchAccessGate />;
  }

  return <>{children}</>;
};

export default RequireResearchAccess;
