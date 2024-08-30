const ROOT_PATH = "/";

export function sanitizeReferrer({
  referrer,
  origin,
}: {
  referrer: string;
  origin: string;
}) {
  if (referrer === "") return ROOT_PATH;

  const parsedReferral = new URL(referrer);
  const referralOrigin = parsedReferral.origin;
  return referralOrigin === origin ? referrer : ROOT_PATH;
}
