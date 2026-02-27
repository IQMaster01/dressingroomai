import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TRYON_SYSTEM_PROMPT = `You are a professional AI fashion try-on engine.

Your task: Generate a realistic image of the person from the FIRST image wearing the clothing item shown in the SECOND image.

IDENTITY PRESERVATION RULES (MANDATORY):
- DO NOT change the face.
- DO NOT modify facial structure.
- DO NOT modify facial expression.
- DO NOT change skin tone.
- DO NOT change body structure.
- DO NOT alter body proportions.
- DO NOT make body slimmer, muscular, taller or shorter.
- Keep hairstyle exactly same.
- Keep upper body pose same.
- Keep camera angle same.
- Maintain natural lighting.

BODY COMPLETION RULES:
- If the user's image is partial (half body or upper body only), intelligently extend the body to match the clothing type.
- Maintain same body type and proportions.
- Ensure realistic anatomy.
- Keep seamless blending between original and generated areas.
- Do not distort identity.

CLOTHING RULES:
- Replace only existing clothing with the clothing from the second image.
- Preserve realistic fabric texture.
- Maintain natural folds and shadows.
- Ensure proper fitting based on real body proportions.
- Maintain correct scale and perspective.
- If second image shows a person wearing clothes, extract the clothing from that person and apply it to the first person.
- If upper wear → replace upper clothing only.
- If lower wear → replace lower clothing only.
- If full outfit → replace entire clothing.

QUALITY REQUIREMENTS:
- Ultra realistic
- High resolution
- E-commerce photography style
- Natural blending
- No distortion
- No face morphing
- No AI artifacts
- No blur

OUTPUT: Generate one clean realistic image where the person from the first image is wearing the clothing from the second image while keeping identity 100% unchanged.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userImage, clothImage } = await req.json();

    if (!userImage || !clothImage) {
      return new Response(
        JSON.stringify({ error: "Both user image and clothing image are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Sending try-on request to AI gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: TRYON_SYSTEM_PROMPT },
              {
                type: "image_url",
                image_url: { url: userImage },
              },
              {
                type: "image_url",
                image_url: { url: clothImage },
              },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI generation failed. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImage) {
      console.error("No image in AI response:", JSON.stringify(data).slice(0, 500));
      return new Response(
        JSON.stringify({ error: "AI did not generate an image. Please try different photos." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ resultImage: generatedImage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("virtual-tryon error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
