export const flowIds = [
  "/beratungshilfe/antrag",
  "/beratungshilfe/vorabcheck",
  "/geld-einklagen/vorabcheck",
  "/geld-einklagen/formular",
  "/fluggastrechte/vorabcheck",
  "/fluggastrechte/formular",
  "/prozesskostenhilfe/formular",
] as const;

export type FlowId = (typeof flowIds)[number];

const isFlowId = (s: string): s is FlowId => flowIds.includes(s as FlowId);

export function flowIdFromPathname(pathname: string) {
  const flowIdMaybe = pathname.split("/").slice(0, 3).join("/");
  return isFlowId(flowIdMaybe) ? flowIdMaybe : undefined;
}

export function parsePathname(pathname: string) {
  const flowId = flowIdFromPathname(pathname);
  if (!flowId) throw Error(`Unknown flow ID for path ${pathname}`);
  const arrayIndexes =
    pathname
      .match(/(\/\d+)/g)
      ?.map((index) => Number(index.replace("/", ""))) ?? [];
  const stepId = pathname
    .replace(flowId, "")
    .split("/")
    .join("/")
    .replaceAll(/(\/\d+)/g, "");
  return { flowId, stepId, arrayIndexes };
}
