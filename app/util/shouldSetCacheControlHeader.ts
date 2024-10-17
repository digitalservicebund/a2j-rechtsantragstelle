import { flowIdFromPathname } from "~/flows/flowIds";

const isFlowIdInPathname = (pathname: string): boolean => {
  const flowId = flowIdFromPathname(pathname);
  return typeof flowId !== "undefined";
};

const isTrackingConsentSet = (loaderHeaders: Headers): boolean => {
  return loaderHeaders.get("trackingConsentSet") === "true";
};

export const shouldSetCacheControlHeader = (
  loaderHeaders: Headers,
): boolean => {
  const pathname = loaderHeaders.get("pathname") || "";
  return isTrackingConsentSet(loaderHeaders) || isFlowIdInPathname(pathname);
};
