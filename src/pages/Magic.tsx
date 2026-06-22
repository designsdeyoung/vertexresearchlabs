import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import logoFull from "@/assets/logo-full.png";

const Magic = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Already signed in — go straight to dashboard
  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    const token = searchParams.get("t");
    if (!token) { setError("Invalid link."); return; }

    supabase.functions.invoke("exchange-magic-token", { body: { token } })
      .then(({ data, error: fnErr }) => {
        if (fnErr || data?.error || !data?.url) {
          setError("This link couldn't be verified. Please sign in at vertexresearchlabs.com/auth.");
          return;
        }
        // Redirect to the Supabase magic link — completes sign-in
        window.location.href = data.url;
      });
  }, []);

  if (error) {
    return (
      <div style={{ fontFamily: "sans-serif", background: "#0a0a0a", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <img src={logoFull} alt="Vertex Research Labs" style={{ height: 40, marginBottom: 24 }} />
        <p style={{ color: "#888", fontSize: 14, textAlign: "center", maxWidth: 300 }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "sans-serif", background: "#0a0a0a", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <img src={logoFull} alt="Vertex Research Labs" style={{ height: 40 }} />
      <p style={{ color: "#00B4D8", fontSize: 14 }}>Signing you in…</p>
    </div>
  );
};

export default Magic;
