import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const COOKIE_NAME = "vrl_ref";
const LS_KEY = "vrl_ref";
const COOKIE_DAYS = 30;

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Returns the stored referral code from cookie or localStorage */
export function getStoredReferralCode(): string | null {
  return getCookie(COOKIE_NAME) || localStorage.getItem(LS_KEY) || null;
}

/**
 * Hook: captures ?ref=CODE from URL on landing,
 * stores in cookie (30d) + localStorage as backup.
 * Place in App-level component inside BrowserRouter.
 */
export function useReferralCapture() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode && refCode.trim()) {
      const code = refCode.trim();
      // Store in cookie + localStorage
      setCookie(COOKIE_NAME, code, COOKIE_DAYS);
      localStorage.setItem(LS_KEY, code);
      console.log(`[Referral] Captured referral code: ${code}`);

      // Clean ?ref= from URL without reload
      searchParams.delete("ref");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
}
