import type { SiteSection } from "../../types/site";
import type { Prospect } from "../../db/repository";

/**
 * Stage 4 of the AI pipeline — assigns images to section slots.
 *
 * Stub implementation: passes sections through unchanged.
 * Full implementation is provided by TASK-53 (3-tier priority: uploads > scraped > Pexels).
 */
export async function assignImages(
  sections: SiteSection[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prospect: Prospect,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _batchId: string,
): Promise<SiteSection[]> {
  return sections;
}
