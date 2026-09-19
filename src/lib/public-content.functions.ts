import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const getPublicContent = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
  const client = createClient<Database>(process.env['SUPABASE_URL']!, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => { const headers = new Headers(init?.headers); if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization"); headers.set("apikey", key); return fetch(input, { ...init, headers }); } } });
  const [settingsResult, reviewsResult, caseStudiesResult, imagesResult, serviceContentResult] = await Promise.all([
    client.from("site_settings").select("contact_person,phone,whatsapp,email,address,social_media").limit(1).maybeSingle(),
    client.from("reviews").select("id,customer_name,company,photo_path,review,rating,service,review_date,verified").eq("published", true).order("review_date", { ascending: false }),
    client.from("case_studies").select("id,service_slug,title,summary,challenge,solution,outcome,image_path").eq("published", true).order("created_at", { ascending: false }),
    client.from("site_images").select("image_key,storage_path,alt_text").eq("published", true),
    client.from("service_content").select("*"),
  ]);
  const publishedPaths = [
    ...(imagesResult.data ?? []).map((item) => item.storage_path),
    ...(reviewsResult.data ?? []).flatMap((item) => item.photo_path ? [item.photo_path] : []),
    ...(caseStudiesResult.data ?? []).flatMap((item) => item.image_path ? [item.image_path] : []),
  ];
  let signedUrls = new Map<string, string>();
  if (publishedPaths.length) {
    // Signed-URL generation must never take the whole homepage down: if the
    // service role key is missing/misconfigured or storage errors out, log
    // it and continue rendering with whatever images/reviews have no photo.
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin.storage.from("site-media").createSignedUrls(publishedPaths, 3600);
      if (error) console.error("[getPublicContent] createSignedUrls failed:", error.message);
      signedUrls = new Map((data ?? []).flatMap((item, index) => item.signedUrl ? [[publishedPaths[index] ?? "", item.signedUrl] as const] : []));
    } catch (error) {
      console.error("[getPublicContent] Could not create signed URLs for site media (check SUPABASE_SERVICE_ROLE_KEY):", error instanceof Error ? error.message : error);
    }
  }
  return {
    settings: settingsResult.data,
    reviews: (reviewsResult.data ?? []).map((item) => ({ ...item, photo_url: item.photo_path ? signedUrls.get(item.photo_path) ?? null : null })),
    caseStudies: (caseStudiesResult.data ?? []).map((item) => ({ ...item, image_url: item.image_path ? signedUrls.get(item.image_path) ?? null : null })),
    images: (imagesResult.data ?? []).map((item) => ({ ...item, url: signedUrls.get(item.storage_path) ?? null })),
    serviceContent: serviceContentResult.data ?? [],
  };
});
