import { useId } from "react";
import type { RewardsTier } from "@/data/rewardsProgram";

interface TierCardProps {
  tier: RewardsTier;
  /** `large` is used on the rewards page tier showcase */
  size?: "compact" | "large";
}

/** Single tier color block — arched label on an SVG textPath, circular icon
 *  badge, bold value line, divider, then qualifying criteria in small caps. */
const TierCard = ({ tier, size = "compact" }: TierCardProps) => {
  const arcId = useId();
  const Icon = tier.icon;
  const large = size === "large";

  return (
    <div
      className={`group/tier relative flex h-full flex-col items-center overflow-hidden rounded-card text-center text-white shadow-boutique transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-boutique-lift ${tier.cardClass} ${
        large ? "px-7 pb-9 pt-4" : "px-5 pb-7 pt-3"
      }`}
    >
      {/* Arched tier label */}
      <svg
        viewBox="0 0 220 56"
        className="w-full max-w-[220px]"
        aria-hidden="true"
      >
        <path
          id={arcId}
          d="M 14 52 Q 110 8 206 52"
          fill="none"
        />
        <text className="fill-white/90 font-mono text-[13px] tracking-[0.22em]">
          <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
            {tier.arcLabel}
          </textPath>
        </text>
      </svg>

      {/* Icon badge */}
      <div
        className={`flex items-center justify-center rounded-full bg-white text-navy shadow-boutique transition-transform duration-200 ease-out group-hover/tier:scale-105 ${
          large ? "mt-2 h-16 w-16" : "mt-1 h-14 w-14"
        }`}
      >
        <Icon size={large ? 28 : 24} strokeWidth={1.75} />
      </div>

      {/* Value line */}
      <p
        className={`mt-4 font-display font-black leading-none tracking-tight ${
          large ? "text-3xl" : "text-2xl"
        }`}
      >
        {tier.headline}
      </p>
      <p className={`mt-1.5 font-medium text-white/85 ${large ? "text-sm" : "text-[13px]"}`}>
        {tier.headlineSub}
      </p>

      {/* Perks */}
      <ul className={`mt-3 space-y-1 text-white/80 ${large ? "text-[13px]" : "text-xs"}`}>
        {tier.perks.map((perk) => (
          <li key={perk}>{perk}</li>
        ))}
      </ul>

      {/* Divider + qualifier */}
      <div className="mt-auto w-full pt-4">
        <div className="mx-auto h-px w-16 bg-white/35" />
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">
          {tier.qualifier}
        </p>
      </div>
    </div>
  );
};

export default TierCard;
