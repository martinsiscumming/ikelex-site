import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({ password: z.string().min(12).max(128) });
export const activateAdminAccount = createServerFn({ method: "POST" }).inputValidator((input) => schema.parse(input)).handler(async ({ data }) => {
  const configuredPassword = process.env['IKELEX_ADMIN_PASSWORD'];
  if (!configuredPassword || data.password !== configuredPassword) throw new Error("The administrator password is incorrect.");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const roleCheck = await supabaseAdmin.from("user_roles").select("id").eq("role", "admin").limit(1);
  if (roleCheck.error) throw new Error("Administrator setup is unavailable.");
  const listed = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listed.error) throw new Error("Administrator setup is unavailable.");
  const email = "admin@ikelex.admin";
  let user = listed.data.users.find((candidate) => candidate.email === email);
  if (!user) { const created = await supabaseAdmin.auth.admin.createUser({ email, password: data.password, email_confirm: true }); if (created.error || !created.data.user) { console.error("Administrator creation failed:", created.error?.message ?? "No user returned"); throw new Error("Administrator account could not be created."); } user = created.data.user; }
  else { const updated = await supabaseAdmin.auth.admin.updateUserById(user.id, { password: data.password, email_confirm: true }); if (updated.error) throw new Error("Administrator password could not be set."); }
  const profile = await supabaseAdmin.from("profiles").upsert({ user_id: user.id, username: "admin", display_name: "ADMIN" }, { onConflict: "user_id" });
  const role = await supabaseAdmin.from("user_roles").upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });
  if (profile.error || role.error) throw new Error("Administrator permissions could not be completed.");
  return { ok: true };
});
