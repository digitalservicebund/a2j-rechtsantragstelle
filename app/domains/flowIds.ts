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
  "/erbschein/erbfolge",
  "/erbschein/wegweiser",
  "/erbschein/nachlassgericht",
  "/erbschein/anfrage",
  "/erbausschlagung/anfrage",
  "/erbausschlagung/gericht-finden",
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
  // TODO: remove after migration to new flow engine
  const arrayFlows: FlowId[] = [
    "/geld-einklagen/formular",
    "/erbschein/erbfolge",
    "/erbschein/anfrage",
    "/erbausschlagung/anfrage",
  ];
  const numSubstitute = arrayFlows.includes(flowId) ? "/#" : "";
  const stepId = pathname
    .replace(flowId, "")
    .replaceAll(/(\/\d+)/g, numSubstitute);
  return { flowId, stepId, arrayIndexes };
}
