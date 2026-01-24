import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a helpful research assistant for Vertex Research Labs, a supplier of ultra-high purity research-grade peptides and analytical reference materials.

## Company Information
- Email: info@vertexresearchlabs.com
- Phone: 727-295-1338
- Address: 1444 S Belcher RD STE C-103, Clearwater FL 33764
- Orders: orders@vertexresearchlabs.com

## Product Catalog (Research-Grade Peptides)
All products are for research purposes only. Here are our available peptides:

1. **GHK-Cu** - 50mg, $69.99 - Copper peptide complex, 99%+ purity
2. **BPC-157** - 10mg, $54.99 - Body Protection Compound, 99%+ purity
3. **TB-500** - 10mg, $79.99 - Thymosin Beta-4 Fragment, 99%+ purity
4. **Retatrutide** - 5mg, $89.99 - Triple-acting GIP/GLP-1/Glucagon receptor agonist, 99%+ purity
5. **Sermorelin** - 5mg, $59.99 - Growth hormone releasing peptide, 99%+ purity
6. **Tesamorelin** - 5mg, $74.99 - GHRH analog, 99%+ purity
7. **SLU-PP-332** - 5mg, $89.99 - ERR agonist compound, 99%+ purity
8. **NAD+** - 500mg, $79.99 - Nicotinamide Adenine Dinucleotide, 99%+ purity
9. **Semax** - 30mg, $49.99 - Synthetic peptide nootropic, 99%+ purity
10. **Selank** - 10mg, $54.99 - Anxiolytic peptide, 99%+ purity
11. **PT-141** - 10mg, $64.99 - Bremelanotide, 99%+ purity
12. **MT-2** - 10mg, $49.99 - Melanotan II, 99%+ purity
13. **Kisspeptin-10** - 5mg, $69.99 - Reproductive hormone regulator, 99%+ purity
14. **MOTS-c** - 5mg, $84.99 - Mitochondrial-derived peptide, 99%+ purity

## Shipping Policy
- **Free US Shipping** on orders over $99
- Standard shipping rates apply for orders under $99
- We ship to research institutions, laboratories, and qualified researchers

## Quality Standards
- All products have 99%+ verified purity
- Independent third-party testing via HPLC and Mass Spectrometry
- Certificates of Analysis (COAs) available for all products
- Strict chain of custody and batch documentation
- ISO-compliant handling procedures

## Important Disclaimers
- ALL products are for RESEARCH USE ONLY
- Not for human consumption
- Not intended for diagnostic or therapeutic use
- Purchasers must be qualified researchers or institutions
- Products are sold as analytical reference materials

## Your Role
- Answer questions about products, pricing, purity, and availability
- Explain shipping policies and quality standards
- Help researchers find the right peptides for their research
- Always remind users that products are for research use only
- For complex orders, quotes, or specific questions, direct customers to contact us at info@vertexresearchlabs.com or use the contact form
- Be professional, helpful, and scientifically accurate
- Keep responses concise but informative`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Sending chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "We're experiencing high demand. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Unable to process your request. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response back to client");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
