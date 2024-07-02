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
  const flowID = [pathname.split("/")[1], pathname.split("/")[2]].join("/");
  if (isFlowId(flowID)) return flowID;
  throw Error("Unknown flow ID");
}
export function parsePathname(pathname: string) {
  const pathSegments = pathname.split("/");
  const flowId = `${pathSegments[1]}/${pathSegments[2]}`;
  if (!isFlowId(flowId)) throw Error("Unknown flow ID");
  const arrayIndexes =
    pathname
      .match(/(\/\d+)/g)
      ?.map((index) => Number(index.replace("/", ""))) ?? [];
  const stepId = pathSegments
    .slice(3)
    .join("/")
    .replaceAll(/(\/\d+)/g, "");
  return { flowId, stepId, arrayIndexes };
}
