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
  "/nachlass/erbschein/erbfolge", // Delete after /nachlass migration
  "/nachlass/erbschein/wegweiser", // Delete after /nachlass migration
  "/nachlass/erbschein/nachlassgericht", // Delete after /nachlass migration
  "/nachlass/erbschein/anfrage", // Delete after /nachlass migration
  "/nachlass/erbausschlagung/anfrage", // Delete after /nachlass migration
  "/nachlass/erbausschlagung/gericht-finden", // Delete after /nachlass migration
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
    "/nachlass/erbschein/erbfolge", // Delete after /nachlass migration
    "/nachlass/erbschein/anfrage", // Delete after /nachlass migration
    "/geld-einklagen/formular",
    "/nachlass/erbausschlagung/anfrage",
    "/prozesskostenhilfe/formular",
  ];
  const numSubstitute = arrayFlows.includes(flowId) ? "/#" : "";
  const stepId = pathname
    .replace(flowId, "")
    .replaceAll(/(\/\d+)/g, numSubstitute);
  return { flowId, stepId, arrayIndexes };
}
