# Virtual Style Lab

Create a production-ready AI SaaS website called “Changing Room AI” – an advanced Virtual Try-On platform.

CORE CONCEPT:

Users upload:

1) Their personal photo (full body OR half body OR upper body)

2) A clothing image (either their own OR selected from admin affiliate gallery)

The system uses Gemini API to generate a realistic image showing the user wearing the selected clothing.

CRITICAL IDENTITY REQUIREMENTS (VERY STRICT):

The AI must NOT change:

- Face

- Facial expression

- Facial structure

- Skin tone

- Body shape

- Body proportions

- Body size

- Hairstyle

- Pose (upper body pose must remain same)

- Camera angle

Identity must remain EXACTLY the same person.

--------------------------------------------------

SPECIAL BODY GENERATION LOGIC:

If user uploads:

- Full body image → Replace clothing only.

- Half body image → Generate the missing lower/upper portion naturally to match clothing type.

- Only upper body image → If full outfit is selected, generate lower body realistically while keeping same body structure.

- Only lower body image → If upper clothing is selected, generate upper portion naturally.

IMPORTANT:

- Generated body must match user's natural proportions.

- Do NOT change body type.

- Do NOT make user slimmer, muscular, taller, shorter, etc.

- Maintain realistic anatomical proportions.

- Preserve facial identity completely.

- Maintain consistent lighting and perspective.

--------------------------------------------------

TECH STACK REQUIREMENTS:

- Frontend: Next.js + TailwindCSS

- Backend: Node.js (API routes or serverless functions)

- Gemini API integration (backend only)

- Secure image upload system

- Temporary storage (auto delete after 24 hours)

- Affiliate tracking system

- Admin dashboard

- Fully responsive

- Production-ready folder structure

IMPORTANT:

Gemini API key must be stored in environment variables.

Never expose API key to frontend.

All AI calls must be made from backend only.

--------------------------------------------------

AI GENERATION MASTER PROMPT (LOCK THIS IN BACKEND):

You are a professional AI fashion try-on engine.

Your task:

Generate a realistic image of the person from USER_IMAGE wearing the clothing item from CLOTH_IMAGE.

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

- If image is partial, intelligently extend body to match clothing type.

- Maintain same body type and proportions.

- Ensure realistic anatomy.

- Keep seamless blending between original and generated areas.

- Do not distort identity.

CLOTHING RULES:

- Replace only existing clothing with CLOTH_IMAGE.

- Preserve realistic fabric texture.

- Maintain natural folds and shadows.

- Ensure proper fitting based on real body proportions.

- Maintain correct scale and perspective.

- If upper wear → replace upper only.

- If lower wear → replace lower only.

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

OUTPUT:

Generate one clean realistic image where the person is wearing the uploaded clothing while keeping identity 100% unchanged.

--------------------------------------------------

MAIN FEATURES:

1) HOMEPAGE

- Hero section: “Your Personal AI Changing Room”

- CTA: “Try Now”

- Premium fashion startup look

- White + black modern theme

- Smooth animations

2) TRY-ON PAGE

- Upload user image (jpg/png, max 5MB)

- Upload clothing image OR select from affiliate gallery

- Generate button

- Loading animation

- Show result

- Download button

- Share button

3) AFFILIATE CLOTHING GALLERY (ADMIN CONTROLLED)

Admin can add:

- Clothing image

- Clothing name

- Description

- Affiliate link

Display in grid:

- “Try This” button

- Cart icon button

When cart icon clicked:

- Open affiliate link in new tab

- Track click in backend

4) USER FLOW:

User uploads:

- Their image

- Either own clothing OR affiliate clothing

System sends both images + fixed AI prompt to Gemini backend

Return generated image

Display preview

5) ADMIN DASHBOARD:

- Add/edit/delete clothes

- Add affiliate links

- View total clicks

- View total try-ons

- Platform analytics

6) DATABASE STRUCTURE:

{

  id,

  name,

  description,

  image_url,

  affiliate_link,

  click_count,

  tryon_count,

  created_at

}

7) TRACKING:

- On try-on → increment tryon_count

- On affiliate click → increment click_count

8) SECURITY:

- Validate file types

- 5MB limit

- Rate limiting

- Secure backend API

- Auto delete images after 24 hours

- No permanent storage

9) SCALABILITY:

- Stripe subscription ready

- Google login ready

- API usage limits

- Cloud deployment ready

--------------------------------------------------

GOAL:

Build a complete, scalable, production-ready AI Virtual Try-On SaaS platform called “Changing Room AI” with strict identity preservation, intelligent body completion, affiliate monetization, admin control panel, and secure Gemini backend integration.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://dressingroomai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a4228cd3-8b7b-4fe9-8506-5cb3e13e6539).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
