import { beratungshilfeVorabcheckPages } from "./beratungshilfe/vorabcheck/pages";
import type { FlowId } from "./flowIds";
import type { PagesConfig } from "./pageConfig";

export const pages: Partial<Record<FlowId, PagesConfig>> = {
  "/beratungshilfe/vorabcheck": beratungshilfeVorabcheckPages,
} as const;

export function getPageSchema(flowId: FlowId, stepId: string) {
  const stepIdWithoutLeadingSlash = stepId.slice(1);
  return pages[flowId]?.[stepIdWithoutLeadingSlash]?.pageSchema;
}
