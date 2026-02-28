import { generateObject } from "ai";
import { model } from "./client";
import {
  contentSchema,
  type CondensedProfile,
  type StructureDecision,
} from "./schemas";
import { buildContentPrompt } from "./prompts";
import type { SiteSection, SectionContent } from "../../types/site";

interface ProspectInput {
  businessName: string;
  industry: string;
  location: string;
}

/**
 * Stage 3 of the AI pipeline — generates copy for all selected sections.
 *
 * Makes a single generateObject call with the full content schema.
 * The AI fills in only the sections present in the structure decision.
 * Returns an array of SiteSection objects with generated content.
 */
export async function generateContent(
  structure: StructureDecision,
  profile: CondensedProfile,
  prospect: ProspectInput,
): Promise<SiteSection[]> {
  const { object } = await generateObject({
    model,
    schema: contentSchema,
    prompt: buildContentPrompt(structure, profile, prospect),
  });

  return structure.sections.map((section, index) => {
    const generatedContent = object[section.type];
    return {
      id: `${section.type}-${index}`,
      type: section.type,
      variant: section.variant,
      visible: true,
      content: (generatedContent ?? {}) as SectionContent,
    };
  });
}
