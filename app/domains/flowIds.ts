import { parseArrayIndexesFromPathname } from "~/services/array/parseArrayIndexesFromPathname";

export const flowIds = [
  "/beratungshilfe/antrag",
  "/beratungshilfe/vorabcheck",
  "/geld-einklagen/formular",
  "/geld-einklagen/anwaltschaft",
  "/fluggastrechte/vorabcheck",
  "/fluggastrechte/formular",
  "/prozesskostenhilfe/formular",
  "/kontopfaendung/wegweiser",
  "/kontopfaendung/pkonto/antrag",
  "/erbschein/erbfolge",
  "/erbschein/wegweiser",
  "/erbschein/nachlassgericht",
  "/erbschein/anfrage",
  "/erbausschlagung/anfrage",
  "/erbausschlagung/gericht-finden",
  "/grundbuchauszug/antrag",
] as const;

export type FlowId = (typeof flowIds)[number];

export function flowIdFromPathname(pathname: string) {
  return flowIds.find(
    (flowId) => pathname === flowId || pathname.startsWith(`${flowId}/`),
  );
}

export function parsePathname(pathname: string) {
  const flowId = flowIdFromPathname(pathname);
  if (!flowId) throw new Error(`Unknown flow ID for path ${pathname}`);
  const arrayIndexes = parseArrayIndexesFromPathname(pathname);
  // Numeric URL segments are always array indexes, so normalize them to the
  // "#" wildcard used in array page stepIds.
  const stepId = pathname.replace(flowId, "").replaceAll(/(\/\d+)/g, "/#");
  return { flowId, stepId, arrayIndexes };
}
