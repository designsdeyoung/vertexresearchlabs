import { useMemo } from "react";

export const POINTS_PER_DOLLAR = 3;
export const AUTOSHIP_POINTS_PER_DOLLAR = 6;
export const REFERRAL_POINTS_MULTIPLIER = 3; // 3x order subtotal
export const REFERRAL_DISCOUNT_PERCENT = 10; // 10% off for code user
export const SOCIAL_POST_POINTS = 250;
export const PHOTO_REVIEW_POINTS = 200;

export interface RewardTier {
  points: number;
  credit: number;
  minCart: number;
  maxPercent: number;
  label: string;
}

export const REWARD_TIERS: RewardTier[] = [
  { points: 500, credit: 20, minCart: 100, maxPercent: 20, label: "$20 Vertex Credit" },
  { points: 750, credit: 30, minCart: 120, maxPercent: 25, label: "$30 Vertex Credit" },
  { points: 1000, credit: 40, minCart: 150, maxPercent: 30, label: "$40 Vertex Credit" },
];

export const calculatePointsForPrice = (price: number, isAutoship = false): number => {
  const multiplier = isAutoship ? AUTOSHIP_POINTS_PER_DOLLAR : POINTS_PER_DOLLAR;
  return Math.floor(price * multiplier);
};

export const useRewards = (pointsBalance: number) => {
  const currentTier = useMemo(() => {
    return REWARD_TIERS.reduce<RewardTier | null>((best, tier) => {
      if (pointsBalance >= tier.points) return tier;
      return best;
    }, null);
  }, [pointsBalance]);

  const nextTier = useMemo(() => {
    return REWARD_TIERS.find((tier) => pointsBalance < tier.points) || null;
  }, [pointsBalance]);

  const pointsToNextTier = useMemo(() => {
    if (!nextTier) return 0;
    return nextTier.points - pointsBalance;
  }, [nextTier, pointsBalance]);

  const progressToNextTier = useMemo(() => {
    if (!nextTier) return 100;
    const prevThreshold = currentTier?.points || 0;
    const range = nextTier.points - prevThreshold;
    const progress = pointsBalance - prevThreshold;
    return Math.min(Math.max((progress / range) * 100, 0), 100);
  }, [pointsBalance, currentTier, nextTier]);

  return {
    currentTier,
    nextTier,
    pointsToNextTier,
    progressToNextTier,
    canRedeem: currentTier !== null,
  };
};
