import { useReferralCapture } from "@/hooks/useReferralCapture";

/** Invisible component that captures referral codes from URL params */
const ReferralCapture = () => {
  useReferralCapture();
  return null;
};

export default ReferralCapture;
