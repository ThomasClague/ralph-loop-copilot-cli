export type { TemplateData } from "./coldOutreach";
export { coldOutreach } from "./coldOutreach";
export { followUp } from "./followUp";

import { coldOutreach } from "./coldOutreach";
import { followUp } from "./followUp";

export const TEMPLATES = {
  coldOutreach,
  followUp,
} as const;

export type TemplateId = keyof typeof TEMPLATES;
