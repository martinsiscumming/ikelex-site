import type { Tables } from "@/integrations/supabase/types";
import { serviceIcons, type ContentItem, type ContentSection, type IconKey, type ProcessStep, type Service, type ServiceContent } from "@/lib/site-data";

type ServiceContentRow = Tables<"service_content">;

function arrayOfStrings(value: unknown, fallback: readonly string[]) {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [...fallback];
}
function arrayOfItems(value: unknown, fallback: readonly ContentItem[]): readonly ContentItem[] {
  return Array.isArray(value) && value.every((item) => typeof item === "object" && item !== null && typeof item.title === "string" && typeof item.description === "string") ? value as ContentItem[] : [...fallback];
}
function arrayOfSections(value: unknown, fallback: readonly ContentSection[]): readonly ContentSection[] {
  return Array.isArray(value) && value.every((section) => typeof section === "object" && section !== null && typeof section.title === "string" && Array.isArray(section.items)) ? value as ContentSection[] : [...fallback];
}
function arrayOfProcess(value: unknown, fallback: readonly ProcessStep[]): readonly ProcessStep[] {
  return Array.isArray(value) && value.every((item) => typeof item === "object" && item !== null && typeof item.title === "string" && typeof item.description === "string") ? value as ProcessStep[] : [...fallback];
}
function arrayOfFaqs(value: unknown, fallback: readonly (readonly [string, string])[]): readonly (readonly [string, string])[] {
  return Array.isArray(value) && value.every((item) => Array.isArray(item) && item.length === 2 && item.every((part) => typeof part === "string")) ? value as [string, string][] : fallback;
}

export function mergeServiceContent(service: Service, row?: ServiceContentRow | null): ServiceContent {
  const fallback = service.content;
  if (!row) return fallback as ServiceContent;
  const iconKey = row.icon_key in serviceIcons ? row.icon_key as IconKey : fallback.iconKey;
  return {
    eyebrow: row.eyebrow, title: row.title, heroDescription: row.hero_description,
    introTitle: row.intro_title, introBody: row.intro_body,
    sections: arrayOfSections(row.sections, fallback.sections), audienceTitle: row.audience_title,
    audiences: arrayOfStrings(row.audiences, fallback.audiences), process: arrayOfProcess(row.process, fallback.process),
    benefits: arrayOfItems(row.benefits, fallback.benefits), faqs: arrayOfFaqs(row.faqs, fallback.faqs),
    heroCta: row.hero_cta, finalHeading: row.final_heading, finalTitle: row.final_title,
    finalBody: row.final_body, primaryCta: row.primary_cta, secondaryCta: row.secondary_cta, iconKey,
  };
}