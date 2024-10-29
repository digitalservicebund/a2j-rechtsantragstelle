import { flowIdFromPathname } from "~/domains/flowIds";

const isFlowIdInPathname = (pathname: string): boolean => {
  const flowId = flowIdFromPathname(pathname);
  return typeof flowId !== "undefined";
};

export const shouldSetCacheControlHeader = (
  pathname: string,
  trackingConsent: "true" | "false" | undefined,
): boolean => {
  return typeof trackingConsent === "undefined" || isFlowIdInPathname(pathname);
};
