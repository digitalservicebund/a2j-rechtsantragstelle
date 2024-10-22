import { flowIdFromPathname } from "~/flows/flowIds";

const isFlowIdInPathname = (pathname: string): boolean => {
  const flowId = flowIdFromPathname(pathname);
  return typeof flowId !== "undefined";
};

export const shouldSetCacheControlHeader = (
  pathname: string,
  trackingConsent: string | undefined,
): boolean => {
  return trackingConsent === "true" || isFlowIdInPathname(pathname);
};
