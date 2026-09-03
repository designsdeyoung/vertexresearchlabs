import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

serve(() => new Response(JSON.stringify({ error: "Automated restock messaging has been retired." }), {
  status: 410,
  headers: { "Content-Type": "application/json" },
}));
