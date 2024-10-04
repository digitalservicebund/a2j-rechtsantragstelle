import type { ProzesskostenhilfeRechtsschutzversicherungContext } from "./context";

export function hasNoRsvAndNoOrg(
  context: ProzesskostenhilfeRechtsschutzversicherungContext,
): boolean {
  return Boolean(context.hasRsv === "no" && context.hasOrg === "no");
}

export function hasPartlyorNoCoverage(
  context: ProzesskostenhilfeRechtsschutzversicherungContext,
): boolean {
  return Boolean(
    (context.hasRsvCoverage === "no" || context.hasRsvCoverage === "partly") &&
      (context.hasOrgCoverage === "no" || context.hasOrgCoverage === "partly"),
  );
}
