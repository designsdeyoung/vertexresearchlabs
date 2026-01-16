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
import { FlaskConical } from "lucide-react";

const ResearchDisclaimerDialog = () => {
  const { hasAcknowledged, completeAcknowledgment } = useCompliance();

  return (
    <AlertDialog open={!hasAcknowledged}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <FlaskConical className="h-6 w-6 text-primary" />
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
