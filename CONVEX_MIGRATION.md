# Migrating from Supabase to Convex

This is a real backend swap, not a config change — it touches auth, storage, and every data call in
the app. Below is the concrete plan, in the order I'd do it, with the schema/functions you need. I
have **not** applied this yet (it's big enough to want your go-ahead first); tell me to proceed and
I'll execute it end to end in the codebase.

## What's changing, conceptually

| Today (Supabase) | With Convex |
|---|---|
| Postgres tables + RLS policies | `convex/schema.ts` documents + `query`/`mutation` functions (auth checks live in code, not policies) |
| `supabase.storage` buckets + signed URLs | Convex file storage (`ctx.storage.generateUploadUrl` / `ctx.storage.getUrl`) |
| Custom Supabase-auth "admin" user | `@convex-dev/auth` with a Password provider (single admin account) |
| Server functions calling `supabase-js` on the server | Convex queries called via `ConvexHttpClient` in loaders (SSR) or `useQuery`/`useMutation` in the browser |

## Step 1 — Set up the Convex project

```
npm install convex @convex-dev/auth
npx convex dev   # creates convex/ folder, links/creates a Convex project, gives you a deployment URL
```
Add to `.env` / hosting env vars: `CONVEX_DEPLOYMENT`, `VITE_CONVEX_URL` (the client URL `npx convex dev` prints).

## Step 2 — Schema (`convex/schema.ts`)

```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  reviews: defineTable({
    customerName: v.string(),
    company: v.optional(v.string()),
    photoStorageId: v.optional(v.id("_storage")),
    review: v.string(),
    rating: v.number(),
    service: v.optional(v.string()),
    reviewDate: v.string(),
    verified: v.boolean(),
    published: v.boolean(),
  }).index("by_published", ["published"]),

  caseStudies: defineTable({
    serviceSlug: v.string(),
    title: v.string(),
    summary: v.string(),
    challenge: v.string(),
    solution: v.string(),
    outcome: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    published: v.boolean(),
  }).index("by_published", ["published"]).index("by_service", ["serviceSlug"]),

  siteImages: defineTable({
    imageKey: v.string(),
    storageId: v.id("_storage"),
    altText: v.string(),
    published: v.boolean(),
  }).index("by_key", ["imageKey"]),

  siteSettings: defineTable({
    contactPerson: v.string(),
    phone: v.string(),
    whatsapp: v.string(),
    email: v.optional(v.string()),
    address: v.string(),
    socialMedia: v.any(),
  }),

  inquiries: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    service: v.string(),
    message: v.string(),
    status: v.union(v.literal("new"), v.literal("contacted"), v.literal("closed")),
  }).index("by_status", ["status"]),

  serviceContent: defineTable({
    slug: v.string(),
    eyebrow: v.string(),
    title: v.string(),
    heroDescription: v.string(),
    introTitle: v.string(),
    introBody: v.string(),
    sections: v.array(v.any()),
    audienceTitle: v.string(),
    audiences: v.array(v.any()),
    process: v.array(v.any()),
    benefits: v.array(v.any()),
    faqs: v.array(v.any()),
    heroCta: v.string(),
    finalHeading: v.string(),
  }).index("by_slug", ["slug"]),
});
```

Notes:
- `photo_path` / `storage_path` (a text path into a Supabase bucket) becomes `v.id("_storage")` — an
  actual Convex storage reference. Convex generates the serving URL for you (`ctx.storage.getUrl`),
  so all the manual `createSignedUrls` code you have today (the thing that was crashing the
  homepage when misconfigured) goes away entirely.
- `rating smallint CHECK (1..5)` and the other SQL `CHECK` constraints become validation you write in
  the mutation itself (Convex has no column-level constraints) — I'll port each check.

## Step 3 — Public read functions (`convex/public.ts`)

```ts
import { query } from "./_generated/server";

export const getHomeContent = query({
  handler: async (ctx) => {
    const reviews = await ctx.db.query("reviews").withIndex("by_published", (q) => q.eq("published", true)).order("desc").collect();
    const images = await ctx.db.query("siteImages").withIndex("by_key", (q) => q).collect();
    const withUrls = await Promise.all(
      [...reviews, ...images].map(async (doc) => ({ ...doc })) // resolve storage URLs per item below
    );
    // ... map storageId -> await ctx.storage.getUrl(storageId) for photos/images
    return { reviews, images };
  },
});
```

(I'll write the full, exact versions of `getHomeContent`, `getServiceContent`, `getCaseStudies`
mirroring what `public-content.functions.ts` returns today, so the frontend shape barely changes.)

## Step 4 — Admin mutations (`convex/admin.ts`)

Every mutation starts with an auth check instead of relying on RLS:

```ts
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

async function requireAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export const addReview = mutation({
  args: { customerName: v.string(), company: v.optional(v.string()), review: v.string(), rating: v.number(), service: v.optional(v.string()), reviewDate: v.string(), photoStorageId: v.optional(v.id("_storage")) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    if (args.review.length < 10 || args.review.length > 2000) throw new Error("Review must be 10–2000 characters.");
    if (args.rating < 1 || args.rating > 5) throw new Error("Rating must be 1–5.");
    return await ctx.db.insert("reviews", { ...args, verified: false, published: false });
  },
});

export const setReviewPublished = mutation({
  args: { id: v.id("reviews"), published: v.boolean() },
  handler: async (ctx, { id, published }) => { await requireAdmin(ctx); await ctx.db.patch(id, { published }); },
});

export const deleteReview = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, { id }) => { await requireAdmin(ctx); await ctx.db.delete(id); },
});
```
(Same pattern for case studies, site images, settings, service content — I'll write all of them.)

## Step 5 — File uploads

Replace the manual `supabase.storage.from("site-media").upload(...)` calls with Convex's two-step
upload:
```ts
// 1. ask Convex for a short-lived upload URL (a mutation)
export const generateUploadUrl = mutation({ handler: async (ctx) => { await requireAdmin(ctx); return await ctx.storage.generateUploadUrl(); } });
// 2. in the browser: POST the file to that URL, get back a storageId, then call addReview/uploadSiteImage with it
```

## Step 6 — Auth (single admin account)

`@convex-dev/auth`'s Password provider replaces the current Supabase-auth "admin@ikelex.admin" user.
You'll seed one admin account (via a one-off script or the Convex dashboard) and swap
`admin-account.functions.ts` and `auth-attacher.ts` for Convex Auth's React hooks
(`useAuthActions().signIn`) and server-side `getAuthUserId`.

## Step 7 — Rewire the frontend

- Wrap the app in `<ConvexAuthProvider client={convexClient}>` in `src/router.tsx` / root route.
- `public-content.functions.ts` (a TanStack server function calling Supabase) is replaced by either:
  - calling `fetchQuery(api.public.getHomeContent)` from a `ConvexHttpClient` inside the route
    `loader` (keeps SSR), or
  - dropping the loader and using `useQuery(api.public.getHomeContent)` directly in the component
    (simpler, but the route becomes client-rendered for that data — fine for this content, and it's
    what makes a static-only cPanel deployment possible later).
- `admin.tsx`'s forms swap `supabase.from(...).insert/update/delete` for `useMutation(api.admin.*)`.
- Remove: `src/integrations/supabase/*`, `supabase/` folder, `@supabase/supabase-js` dependency.

## Step 8 — Data migration

Export your existing rows (Supabase Table Editor → export CSV, or `pg_dump`/`psql \copy`) for
`reviews`, `case_studies`, `site_settings`, `service_content`; download the referenced files from the
`site-media` bucket; then write a one-off script using `ConvexHttpClient` to insert each row/file into
Convex. I'll write this script once Step 1–7 are in place, so it maps 1:1 to the new schema.

---

**My recommendation:** say the word and I'll do Steps 1–7 directly in this codebase (schema, all
functions, and rewiring every Supabase call), then hand you Step 8 as a script to run against your
live Supabase project once you're ready to cut over — that way your current site keeps working right
up until the moment you actually run the migration script.
