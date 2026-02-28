import { generateObject } from "ai";
import { model } from "./client";
import {
  structureSchema,
  type CondensedProfile,
  type StructureDecision,
} from "./schemas";
import { buildStructurePrompt } from "./prompts";

interface ProspectInput {
  businessName: string;
  industry: string;
  location: string;
}

/**
 * Stage 2 of the AI pipeline — decides the website structure.
 *
 * Calls Claude with the condensed business profile and asks it to select
 * and order 7–10 sections. Enforces hard rules after the AI responds:
 * - sections[0].type must be 'hero'
 * - sections[last].type must be 'contact' or 'cta_banner'
 */
export async function generateStructure(
  profile: CondensedProfile,
  prospect: ProspectInput,
): Promise<StructureDecision> {
  const { object } = await generateObject({
    model,
    schema: structureSchema,
    prompt: buildStructurePrompt(profile, prospect),
  });

  const sections = [...object.sections];

  // Enforce hero first
  if (sections[0]?.type !== "hero") {
    sections.unshift({
      type: "hero",
      variant: "hero-centered",
      reasoning: "Hero section is required as the first section.",
    });
    // Trim to max 10 if needed
    if (sections.length > 10) sections.splice(10);
  }

  // Enforce contact or cta_banner last
  const last = sections[sections.length - 1];
  if (last?.type !== "contact" && last?.type !== "cta_banner") {
    sections.push({
      type: "contact",
      variant: "contact-form",
      reasoning: "Contact section is required as the last section.",
    });
    // Trim to max 10 if needed
    if (sections.length > 10) sections.splice(10);
  }

  return {
    sections,
    tone: object.tone,
    paletteHint: object.paletteHint,
  };
}
