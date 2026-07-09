import type { LucideIcon } from "lucide-react";
import { FlaskConical, Microscope, Atom } from "lucide-react";
import { products, type Product } from "@/data/products";
import { POINTS_PER_DOLLAR } from "@/hooks/useRewards";

/* ─────────────────────────────────────────────────────────────────────────
 * Vertex Rewards — program structure
 *
 * Flagship mechanic: 3X points on every $1 spent (POINTS_PER_DOLLAR = 3).
 * Every member earns 3X from day one — tiers never change the base rate.
 * Tiers escalate ACCESS, not math: bonus-point events, early restock
 * access, and exclusive redemptions. Qualification is by lifetime points
 * earned (which is just spend × 3, so it never contradicts 3X messaging).
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

/* ─────────────────────────────────────────────────────────────────────────
 * Redemption shop economics
 *
 * Earn rate: 3 pts per $1  →  $1 of spend mints 3 points.
 * Point cost: ~50 pts per $1 of retail value  →  giveback = 3/50 = 6.0%.
 * Big-ticket "halo" items are priced richer (~55 pts/$1 → ~5.5%) so the
 * largest redemptions carry the lowest giveback.
 *
 *   item              retail   points   spend required   giveback
 *   Bac Water 10ml      $15       750       $250           6.0%
 *   Semax               $33     1,650       $550           6.0%
 *   GHK-Cu 50mg         $44     2,200       $733           6.0%
 *   Glutathione         $75     3,750     $1,250           6.0%
 *   Retatrutide         $98     5,400     $1,800           5.4%
 *   NAD+ 1000mg        $150     8,250     $2,750           5.5%
 *
 * Target band is 5–8% of spend — tune a single item by editing its points,
 * or shift the whole menu by scaling toward 40 pts/$1 (7.5%) or 55 (5.5%).
 * ──────────────────────────────────────────────────────────────────────── */

export interface RedemptionReward {
  /** Stable id used for claim persistence — do not reuse across menu edits */
  id: string;
  product: Product;
  points: number;
}

const REDEMPTION_MENU: { productId: string; points: number }[] = [
  { productId: "bac-water-10ml", points: 750 },
  { productId: "semax", points: 1650 },
  { productId: "ghk-cu", points: 2200 },
  { productId: "glutathione", points: 3750 },
  { productId: "retatrutide", points: 5400 },
  { productId: "nad-plus-1000", points: 8250 },
];

export const REDEMPTION_REWARDS: RedemptionReward[] = REDEMPTION_MENU.flatMap(
  ({ productId, points }) => {
    const product = products.find((p) => p.id === productId);
    return product ? [{ id: `redeem-${productId}`, product, points }] : [];
  },
);

/** Spend required to mint a reward's point cost — shown as helper copy. */
export const spendToEarn = (points: number) =>
  Math.ceil(points / POINTS_PER_DOLLAR);

/** Mock starting balance until the backend wire-up — enough to claim the
 *  lower shelf and show the progress state on the upper shelf. */
export const DEFAULT_POINTS_BALANCE = 2850;
