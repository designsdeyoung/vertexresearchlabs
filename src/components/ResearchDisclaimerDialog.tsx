import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCompliance } from "@/contexts/ComplianceContext";
import logoFull from "@/assets/logo-full.png";

const SUPPRESS_ROUTES = ["/order-confirmation", "/dashboard", "/auth"];

const ResearchDisclaimerDialog = () => {
  const { hasAcknowledged, completeAcknowledgment } = useCompliance();

  // Don't show on post-checkout or account routes
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const isSuppressed = SUPPRESS_ROUTES.some((r) => currentPath.startsWith(r));

  return (
    <AlertDialog open={!hasAcknowledged && !isSuppressed}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto">
            <img src={logoFull} alt="Vertex Research Labs" className="h-24 w-auto" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Research Use Only
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base leading-relaxed">
            Vertex Research Labs products are intended solely for laboratory research purposes.
            They are not for human or veterinary use and are not intended to diagnose, treat, cure, or prevent any disease.
            <span className="mt-4 block font-medium text-foreground">
              By continuing, you confirm you understand and agree to these terms.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 sm:justify-center">
          <AlertDialogAction
            onClick={completeAcknowledgment}
            className="w-full sm:w-auto px-8"
          >
            I Understand & Agree
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResearchDisclaimerDialog;
