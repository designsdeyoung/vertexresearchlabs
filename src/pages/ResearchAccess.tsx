import { useNavigate, useSearchParams } from "react-router-dom";
import ResearchAccessGate from "@/components/ResearchAccessGate";

/**
 * Standalone research-access route. Reachable directly (e.g. from checkout when
 * acknowledgment is missing). On completion it routes to the `next` param, or
 * home. When a visitor lands on the catalog without acknowledging, the
 * RequireResearchAccess guard renders the same gate inline instead.
 */
const ResearchAccess = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/";

  return (
    <ResearchAccessGate
      continueLabel="Continue"
      onComplete={() => navigate(next, { replace: true })}
    />
  );
};

export default ResearchAccess;
