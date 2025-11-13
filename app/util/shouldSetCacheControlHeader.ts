import { isFlowIdInPathname } from "~/util/url";

export const shouldSetCacheControlHeader = (
  pathname: string,
  trackingConsent: "true" | "false" | undefined,
): boolean => {
  return !trackingConsent || isFlowIdInPathname(pathname);
};
