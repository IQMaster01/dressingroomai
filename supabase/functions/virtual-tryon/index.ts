import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TRYON_SYSTEM_PROMPT = `You are a professional AI virtual try-on engine.

Your task: Generate a realistic image of the person from the FIRST image wearing the clothing from the SECOND image.

IDENTITY PRESERVATION (STRICT – NEVER BREAK):
- Do NOT change the face.
- Do NOT change facial structure.
- Do NOT change facial expression.
- Do NOT change skin tone.
- Do NOT change body structure.
- Do NOT change body proportions.
- Do NOT make the person slimmer, taller, shorter, muscular, or heavier.
- Keep hairstyle exactly the same.
- Keep upper body pose the same.
- Keep camera angle consistent.
- Preserve natural lighting as much as possible.

BODY HANDLING RULES:

1) If the user image is a FULL BODY image:
   - Keep the entire body exactly the same.
   - Do NOT modify body shape or proportions.
   - Only replace the clothing area.
   - Do not alter arms, legs, torso structure, or posture.

2) If the user image is a HALF BODY or PARTIAL BODY image:
   - Intelligently generate the missing body portion ONLY if required by the clothing type.
   - Generated body must match the user's natural body structure and proportions.
   - Maintain realistic anatomy.
   - Seamlessly blend generated areas with the original image.
   - Do NOT modify the visible original body parts.

CLOTHING PRESERVATION RULES (VERY STRICT):
- Do NOT change cloth structure.
- Do NOT change cloth design.
- Do NOT change cloth color.
- Do NOT change cloth texture.
- Do NOT simplify patterns.
- Do NOT restyle the clothing.

If the second image contains:
- A standalone clothing item → Apply it naturally to the body.
- A person wearing the clothing → Extract and apply the exact clothing design without copying that person's body.

Maintain:
- Original fabric folds
- Stitch patterns
- Prints and logos
- Texture realism
- Correct scale and perspective

QUALITY REQUIREMENTS:
- Ultra realistic
- High resolution
- Natural blending
- No distortion
- No face morphing
- No body reshaping
- No AI artifacts
- No blur

OUTPUT: Generate one clean, realistic image of the original person wearing the exact uploaded clothing, while preserving 100% identity and body structure.`;

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
