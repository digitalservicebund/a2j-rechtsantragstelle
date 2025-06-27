import { beratungshilfeVorabcheckPages } from "./beratungshilfe/vorabcheck/pages";
import { flowIdFromPathname, parsePathname, type FlowId } from "./flowIds";
import type { PagesConfig } from "./pageConfig";

const pages: Partial<Record<FlowId, PagesConfig>> = {
  "/beratungshilfe/vorabcheck": beratungshilfeVorabcheckPages,
} as const;

export function getPageSchema(pathname: string) {
  const flowId = flowIdFromPathname(pathname);
  if (!flowId || !(flowId in pages)) return undefined;
  const { stepId } = parsePathname(pathname);
  const stepIdWithoutLeadingSlash = stepId.slice(1);
  return Object.values(pages[flowId] ?? {}).find(
    (page) => page.url === stepIdWithoutLeadingSlash,
  )?.pageSchema;
}
