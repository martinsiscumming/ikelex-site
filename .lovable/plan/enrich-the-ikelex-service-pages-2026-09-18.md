# Enrich the Ikelex service pages

## What will change

- Keep the current routes, branding, contact details, image library, reviews, case studies, quote-only pricing, and administrator sign-in intact.
- Replace each service page's short generic sections with the exact supplied service-specific hero, overview, capabilities, audience, process, benefits, and FAQ content.
- Keep the shared closing section on every service page with the supplied project invitation and existing Ikelex contact details.
- Use the matching uploaded imagery already assigned to each service, with support for an administrator-managed hero, showcase, and gallery.

## Visual and interaction direction

- Adapt the references rather than copying them wholesale: connected process nodes inspired by the orbital timeline, restrained reveal choreography inspired by ReactBits, static editorial customer quotes inspired by the testimonial columns, and a subtle liquid-glass footer treatment.
- Avoid continuous orbital motion, shader effects, glitch text, and uncontrolled testimonial marquees so the site remains calm, accessible, and fast.
- Preserve the existing navy, blue, cyan, and white Ikelex system with scroll-linked image movement, staggered text, and reduced-motion fallbacks.

## Administrator editing

- Add one secure service-content record for each of the seven existing service URLs.
- Let the administrator edit the service title, hero copy, overview sections, feature descriptions, audience lists, process steps, benefits, FAQs, CTA text, and icon choice.
- Extend image management with per-service hero, showcase, and ordered gallery placements.
- Seed the supplied content in the migration so every page is complete immediately; static content remains a safe fallback if content loading fails.

## Technical details

- Add a `service_content` table with explicit grants, row-level security, admin-only writes, public reads, validation constraints, and update timestamps.
- Store structured service sections as validated JSON while keeping slugs and icon choices constrained to the seven known services.
- Extend the existing public content function and merge editable records with the current service definitions.
- Reuse the existing Motion primitives and design-system components; no heavy graphics dependency is required.

## Verification

- Check all seven canonical and legacy service URLs, metadata, FAQ interaction, image fallbacks, published reviews/case studies, final calls to action, and administrator edits.
- Test desktop and mobile layouts, keyboard behavior, reduced motion, browser errors, and the final build.