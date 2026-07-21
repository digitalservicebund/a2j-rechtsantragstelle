import { parseArrayIndexesFromPathname } from "~/services/array/parseArrayIndexesFromPathname";

export const flowIds = [
  "/beratungshilfe/antrag",
  "/beratungshilfe/vorabcheck",
  "/geld-einklagen/formular",
  "/fluggastrechte/vorabcheck",
  "/fluggastrechte/formular",
  "/nachlass/erbschein/wegweiser",
  "/nachlass/erbschein/nachlassgericht",
  "/erbschein/wegweiser", // Delete after migration
  "/erbschein/nachlassgericht", // Delete after migration
  "/nachlass/erbschein/anfrage",
  "/nachlass/erbausschlagung/anfrage",
  "/nachlass/erbausschlagung/gericht-finden",
  "/prozesskostenhilfe/formular",
  "/kontopfaendung/wegweiser",
  "/kontopfaendung/pkonto/antrag",
  "/nachlass/erbschein/erbfolge",
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
  const arrayFlows: FlowId[] = [
    "/nachlass/erbschein/erbfolge",
    "/nachlass/erbschein/anfrage",
  ];
  const numSubstitute = arrayFlows.includes(flowId) ? "/#" : "";
  const stepId = pathname
    .replace(flowId, "")
    .replaceAll(/(\/\d+)/g, numSubstitute);
  return { flowId, stepId, arrayIndexes };
}
