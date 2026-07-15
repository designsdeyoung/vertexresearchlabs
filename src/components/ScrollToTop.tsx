import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  // GA4's config snippet already counts the initial page load, so only send
  // page_view for client-side route changes after the first render.
  const firstRender = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    trackPageView(pathname + search);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
