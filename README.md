# Project Atlas

Point at a spot on an image, describe the change, and get back an AI-edited
version — built with Next.js (App Router), React, Tailwind CSS, Supabase,
and Stripe, deployed on Vercel.

## Stack

- **Next.js 14 (App Router)** + React + TypeScript
- **Tailwind CSS** for styling
- **Supabase**: Postgres database, Auth, and Storage (image files)
- **Stripe**: subscription billing (Free / Pro plans)
- **AI image editing**: OpenAI `gpt-image-1` `images/edits` by default —
  swap out `runImageEdit()` in `app/api/edit-image/route.ts` for Replicate
  (FLUX.1 Kontext), Google Gemini image editing, or any other provider.

## How the core flow works

1. User uploads an image → stored in the Supabase Storage bucket
   `atlas-images`, with a row in the `images` table.
2. The editor renders the image inside `components/Canvas.tsx`. Clicking the
   image records a **normalized (0–1) x/y position**, independent of the
   image's displayed size.
3. The user types an instruction in `components/InstructionPanel.tsx` and
   submits.
4. `POST /api/edit-image` downloads the source image from Storage, checks
   the user's remaining credits, and calls the AI provider with the image
   plus a prompt that grounds the instruction at the clicked location.
5. The edited image is uploaded back to Storage, an `edits` row is recorded,
   and the URL is returned to the client for display and download.

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql` — this creates the
   `profiles`, `images`, and `edits` tables, row-level security policies,
   and a trigger that auto-creates a profile on signup.
3. Under **Storage**, create a bucket named `atlas-images` and mark it
   **public** (or keep it private and switch `getPublicUrl` calls to signed
   URLs if you need stricter access control).
4. Under **Authentication → URL Configuration**, add
   `http://localhost:3000/auth/callback` (and your production URL) as a
   redirect URL.

### 3. Create a Stripe product

1. Create a recurring monthly price for the Pro plan in the Stripe
   dashboard, and copy its price ID into `STRIPE_PRICE_ID_PRO`.
2. Create a webhook endpoint pointing at `/api/stripe/webhook` listening for
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`, and `invoice.paid`. Copy the signing
   secret into `STRIPE_WEBHOOK_SECRET`.
3. For local testing, use the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### 4. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase, Stripe, and
OpenAI keys.

### 5. Run the dev server

```bash
npm run dev
```

## Deploying to Vercel

1. Push this repo to GitHub and import it into Vercel.
2. Add all variables from `.env.example` under **Project Settings →
   Environment Variables**.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
4. Point your Stripe webhook and Supabase redirect URL at the production
   domain as well.

## Project structure

```
app/
  page.tsx                  Landing page
  (auth)/login, /signup     Auth pages
  dashboard/                Image library + upload
  editor/[id]/              Marker + instruction editor
  pricing/                  Plan comparison + Stripe checkout
  api/edit-image/           Calls the AI image editing model
  api/stripe/               Checkout, billing portal, webhook
components/
  Canvas.tsx                Click-to-place-marker image canvas
  InstructionPanel.tsx      Instruction input + examples
  UploadZone.tsx            Drag-and-drop image upload
  Navbar.tsx                Shared app header
lib/
  supabase/                 Browser, server, and admin Supabase clients
  stripe.ts                 Server-side Stripe client
supabase/schema.sql         Database schema + RLS policies
```

## Notes on the AI editing call

The default implementation sends the full source image plus a text prompt
that describes the click location as a percentage from the top-left corner.
This works well with models that reason over image + text jointly. For
strict pixel-level masking (edit only inside a fixed radius of the marker),
generate a soft-edged circular mask centered at `(markerX, markerY)` server
side and pass it via the `mask` parameter on the edit request instead.
