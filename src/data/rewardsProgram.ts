import type { LucideIcon } from "lucide-react";
import { FlaskConical, Microscope, Atom } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────
 * Vertex Rewards — program structure
 *
 * Flagship mechanic: 3X points on every $1 spent (POINTS_PER_DOLLAR = 3).
 * Every member earns 3X from day one — tiers never change the base rate.
 * Tiers escalate ACCESS, not math: bonus-point events, early restock
 * access, and exclusive redemptions. Qualification is by lifetime points
 * earned (which is just spend × 3, so it never contradicts 3X messaging).
 *
 * Points redeem for STORE CREDIT via REWARD_TIERS in @/hooks/useRewards
 * (250 pts → $10 … 5,000 pts → $250) — the single source of truth shared by
 * checkout, the points-login emails, the packing slips, and the /rewards
 * CreditLadder. Keep redemption values there, not here.
 * ──────────────────────────────────────────────────────────────────────── */

export interface RewardsTier {
  id: string;
  /** Arched label rendered along the SVG textPath, e.g. "TIER 1 · RESEARCHER" */
  arcLabel: string;
  name: string;
  icon: LucideIcon;
  /** Big bold value line, split for typographic control */
  headline: string;
  headlineSub: string;
  perks: string[];
  /** Small-caps qualifying criteria below the divider */
  qualifier: string;
  /** Tailwind classes for the color block */
  cardClass: string;
}

export const REWARDS_TIERS: RewardsTier[] = [
  {
    id: "researcher",
    arcLabel: "TIER 1 · RESEARCHER",
    name: "Researcher",
    icon: FlaskConical,
    headline: "3X POINTS",
    headlineSub: "on every $1 spent",
    perks: ["Automatic enrollment", "Points on every order"],
    qualifier: "Free with your first order",
    cardClass: "bg-deal",
  },
  {
    id: "scientist",
    arcLabel: "TIER 2 · SCIENTIST",
    name: "Scientist",
    icon: Microscope,
    headline: "2X BONUS",
    headlineSub: "point events, all year",
    perks: ["Double-point event invites", "Early restock access"],
    qualifier: "Earn 5,000 lifetime points",
    cardClass: "bg-tierblue",
  },
  {
    id: "partner",
    arcLabel: "TIER 3 · PARTNER",
    name: "Partner",
    icon: Atom,
    headline: "FIRST ACCESS",
    headlineSub: "exclusive redemptions",
    perks: ["Partner-only reward catalog", "Priority fulfillment queue"],
    qualifier: "Earn 15,000 lifetime points",
    cardClass: "bg-tiergreen",
  },
];
