import { parseArrayIndexesFromPathname } from "~/services/array/parseArrayIndexesFromPathname";

export const flowIds = [
  "/beratungshilfe/antrag",
  "/beratungshilfe/vorabcheck",
  "/geld-einklagen/formular",
  "/fluggastrechte/vorabcheck",
  "/fluggastrechte/formular",
  "/prozesskostenhilfe/formular",
  "/kontopfaendung/wegweiser",
  "/kontopfaendung/pkonto/antrag",
] as const;

export type FlowId = (typeof flowIds)[number];

export function flowIdFromPathname(pathname: string) {
  return flowIds.find((flowId) => pathname.startsWith(flowId));
}

export function parsePathname(pathname: string) {
  const flowId = flowIdFromPathname(pathname);
  if (!flowId) throw new Error(`Unknown flow ID for path ${pathname}`);
  const arrayIndexes = parseArrayIndexesFromPathname(pathname);
  const stepId = pathname
    .replace(flowId, "")
    .split("/")
    .join("/")
    .replaceAll(/(\/\d+)/g, "");
  return { flowId, stepId, arrayIndexes };
}
