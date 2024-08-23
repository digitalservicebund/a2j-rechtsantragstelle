export const flowIds = [
  "/beratungshilfe/antrag",
  "/beratungshilfe/vorabcheck",
  "/geld-einklagen/vorabcheck",
  "/geld-einklagen/formular",
  "/fluggastrechte/vorabcheck",
  "/fluggastrechte/formular",
  "/prozesskostenhilfe/formular",
  // TODO: remove /prozesskostenhilfe/antrag
  "/prozesskostenhilfe/antrag",
] as const;

export type FlowId = (typeof flowIds)[number];

const isFlowId = (s: string): s is FlowId => flowIds.includes(s as FlowId);

export function flowIdFromPathname(pathname: string) {
  const pathSegments = pathname.split("/");
  if (pathSegments.length < 3) return undefined;
  const flowIdMaybe = `/${pathSegments[1]}/${pathSegments[2]}`;
  return isFlowId(flowIdMaybe) ? flowIdMaybe : undefined;
}

export function parsePathname(pathname: string) {
  const flowId = flowIdFromPathname(pathname);
  if (!flowId) throw Error("Unknown flow ID");
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
