import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type EligibilityType = "individual" | "laboratory" | "organization" | null;

interface ComplianceState {
  hasAcknowledged: boolean;
  eligibilityType: EligibilityType;
  acknowledgedAt: Date | null;
  acknowledgments: {
    researchUseOnly: boolean;
    notForMedicalUse: boolean;
    termsAccepted: boolean;
  };
}

// Persist the research-access acknowledgment per device so the gate is a
// one-time step. Bump the version suffix to force re-acknowledgment after
// material changes to the terms.
const STORAGE_KEY = "vrl_research_access_v1";

const loadPersisted = (): ComplianceState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ComplianceState & { acknowledgedAt: string | null };
    if (!parsed?.hasAcknowledged) return null;
    return {
      ...parsed,
      acknowledgedAt: parsed.acknowledgedAt ? new Date(parsed.acknowledgedAt) : null,
    };
  } catch {
    return null;
  }
};

interface ComplianceContextType extends ComplianceState {
  setAcknowledgments: (acks: ComplianceState["acknowledgments"]) => void;
  setEligibilityType: (type: EligibilityType) => void;
  completeAcknowledgment: () => void;
  resetCompliance: () => void;
  isFullyAcknowledged: () => boolean;
}

const initialState: ComplianceState = {
  hasAcknowledged: false,
  eligibilityType: null,
  acknowledgedAt: null,
  acknowledgments: {
    researchUseOnly: false,
    notForMedicalUse: false,
    termsAccepted: false,
  },
};

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

export const ComplianceProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ComplianceState>(() => loadPersisted() ?? initialState);

  // Persist acknowledgment so the gate stays satisfied across reloads/visits.
  useEffect(() => {
    try {
      if (state.hasAcknowledged) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* storage unavailable — fall back to in-memory only */
    }
  }, [state]);

  const setAcknowledgments = useCallback((acks: ComplianceState["acknowledgments"]) => {
    setState(prev => ({
      ...prev,
      acknowledgments: acks,
    }));
  }, []);

  const setEligibilityType = useCallback((type: EligibilityType) => {
    setState(prev => ({
      ...prev,
      eligibilityType: type,
    }));
  }, []);

  const completeAcknowledgment = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasAcknowledged: true,
      acknowledgedAt: new Date(),
    }));
  }, []);

  const resetCompliance = useCallback(() => {
    setState(initialState);
  }, []);

  const isFullyAcknowledged = useCallback(() => {
    const { acknowledgments, eligibilityType } = state;
    return (
      acknowledgments.researchUseOnly &&
      acknowledgments.notForMedicalUse &&
      acknowledgments.termsAccepted &&
      eligibilityType !== null
    );
  }, [state]);

  return (
    <ComplianceContext.Provider
      value={{
        ...state,
        setAcknowledgments,
        setEligibilityType,
        completeAcknowledgment,
        resetCompliance,
        isFullyAcknowledged,
      }}
    >
      {children}
    </ComplianceContext.Provider>
  );
};

export const useCompliance = () => {
  const context = useContext(ComplianceContext);
  if (!context) {
    throw new Error("useCompliance must be used within ComplianceProvider");
  }
  return context;
};
