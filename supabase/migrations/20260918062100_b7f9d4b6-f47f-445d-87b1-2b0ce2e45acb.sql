CREATE TABLE public.service_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug IN ('app-software-development','qr-code-digital-menu','computers-it-services','hotel-pos-inventory','graphics-design-branding','digital-growth','it-security-solutions')),
  eyebrow text NOT NULL CHECK (char_length(eyebrow) BETWEEN 1 AND 80),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 140),
  hero_description text NOT NULL CHECK (char_length(hero_description) BETWEEN 1 AND 700),
  intro_title text NOT NULL CHECK (char_length(intro_title) BETWEEN 1 AND 140),
  intro_body text NOT NULL CHECK (char_length(intro_body) BETWEEN 1 AND 1500),
  sections jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(sections) = 'array'),
  audience_title text NOT NULL DEFAULT 'Who Is It For?' CHECK (char_length(audience_title) BETWEEN 1 AND 100),
  audiences jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(audiences) = 'array'),
  process jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(process) = 'array'),
  benefits jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(benefits) = 'array'),
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(faqs) = 'array'),
  hero_cta text NOT NULL DEFAULT 'Start a Project' CHECK (char_length(hero_cta) BETWEEN 1 AND 60),
  final_heading text NOT NULL DEFAULT 'Have a project in mind?' CHECK (char_length(final_heading) BETWEEN 1 AND 100),
  final_title text NOT NULL DEFAULT 'Let''s build the right technology solution for your business.' CHECK (char_length(final_title) BETWEEN 1 AND 180),
  final_body text NOT NULL DEFAULT 'Tell us what you need and let''s discuss how Ikelex Technology can help.' CHECK (char_length(final_body) BETWEEN 1 AND 400),
  primary_cta text NOT NULL DEFAULT 'Start a Project' CHECK (char_length(primary_cta) BETWEEN 1 AND 60),
  secondary_cta text NOT NULL DEFAULT 'Contact Us' CHECK (char_length(secondary_cta) BETWEEN 1 AND 60),
  icon_key text NOT NULL DEFAULT 'code' CHECK (icon_key IN ('code','qr-code','computer','hotel','palette','growth','security')),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.service_content TO authenticated;
GRANT ALL ON public.service_content TO service_role;
ALTER TABLE public.service_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads service content" ON public.service_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins create service content" ON public.service_content FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update service content" ON public.service_content FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins delete service content" ON public.service_content FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TRIGGER service_content_updated_at BEFORE UPDATE ON public.service_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();