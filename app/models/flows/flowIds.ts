export const flowIds = [
  "beratungshilfe/antrag",
  "beratungshilfe/vorabcheck",
  "geld-einklagen/vorabcheck",
  "geld-einklagen/formular",
  "fluggastrechte/vorabcheck",
  "fluggastrechte/formular",
] as const;

export type FlowId = (typeof flowIds)[number];

const isFlowId = (s: string): s is FlowId => flowIds.includes(s as FlowId);

export function flowIDFromPathname(pathname: string) {
  const pathSegments = pathname.split("/");
  if (pathSegments.length < 3) return "";
  return [pathSegments[1], pathSegments[2]].join("/");
}

export function parsePathname(pathname: string) {
  const flowId = flowIDFromPathname(pathname);
  if (!isFlowId(flowId)) throw Error("Unknown flow ID");
  const arrayIndexes =
    pathname
      .match(/(\/\d+)/g)
      ?.map((index) => Number(index.replace("/", ""))) ?? [];
  const stepId = pathname
    .split("/")
    .slice(3)
    .join("/")
    .replaceAll(/(\/\d+)/g, "");
  return { flowId, stepId, arrayIndexes };
}
