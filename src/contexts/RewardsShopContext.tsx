import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_POINTS_BALANCE,
  REDEMPTION_REWARDS,
} from "@/data/rewardsProgram";

/* Client-side redemption state. All mutations flow through `redeem()` so a
 * real backend can slot in later by replacing the load/persist pair below
 * with API calls — the component tree only sees this context shape. */

export interface ClaimedReward {
  rewardId: string;
  claimedAt: string; // ISO timestamp
}

interface RewardsShopValue {
  balance: number;
  claimed: ClaimedReward[];
  isClaimed: (rewardId: string) => boolean;
  /** Deducts points and records the claim. Returns false when the reward is
   *  unknown, already claimed, or the balance is insufficient. */
  redeem: (rewardId: string) => boolean;
}

interface PersistedState {
  balance: number;
  claimed: ClaimedReward[];
}

const STORAGE_KEY = "vrl-rewards-shop-v1";

const loadState = (): PersistedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (typeof parsed.balance === "number" && Array.isArray(parsed.claimed)) {
        return parsed;
      }
    }
  } catch {
    // fall through to defaults (private mode, corrupted payload)
  }
  return { balance: DEFAULT_POINTS_BALANCE, claimed: [] };
};

const persistState = (state: PersistedState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // non-fatal: state simply won't survive a reload
  }
};

const RewardsShopContext = createContext<RewardsShopValue | null>(null);

export const RewardsShopProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PersistedState>(loadState);

  useEffect(() => {
    persistState(state);
  }, [state]);

  const isClaimed = useCallback(
    (rewardId: string) => state.claimed.some((c) => c.rewardId === rewardId),
    [state.claimed],
  );

  const redeem = useCallback(
    (rewardId: string) => {
      const reward = REDEMPTION_REWARDS.find((r) => r.id === rewardId);
      if (!reward) return false;
      let ok = false;
      setState((prev) => {
        const alreadyClaimed = prev.claimed.some((c) => c.rewardId === rewardId);
        if (alreadyClaimed || prev.balance < reward.points) return prev;
        ok = true;
        return {
          balance: prev.balance - reward.points,
          claimed: [
            ...prev.claimed,
            { rewardId, claimedAt: new Date().toISOString() },
          ],
        };
      });
      return ok;
    },
    [],
  );

  const value = useMemo(
    () => ({ balance: state.balance, claimed: state.claimed, isClaimed, redeem }),
    [state, isClaimed, redeem],
  );

  return (
    <RewardsShopContext.Provider value={value}>
      {children}
    </RewardsShopContext.Provider>
  );
};

export const useRewardsShop = () => {
  const ctx = useContext(RewardsShopContext);
  if (!ctx) {
    throw new Error("useRewardsShop must be used within RewardsShopProvider");
  }
  return ctx;
};
