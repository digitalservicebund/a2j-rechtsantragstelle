export function sanitizeReferrer(referrer: string, origin: string) {
  const rootPath = "/";

  if (referrer === "") return rootPath;

  const parsedReferral = new URL(referrer);
  const referralOrigin = parsedReferral.origin;
  return referralOrigin === origin ? referrer : rootPath;
}
