import type { ProzesskostenhilfeRechtschutzversicherungContext } from "./context";

export function hasNoRsvOrOrg(
  context: ProzesskostenhilfeRechtschutzversicherungContext,
): boolean {
  return Boolean(context.hasRsv === "no" && context.hasRsvThroughOrg === "no");
}

export function hasPartlyorNoCoverage(
  context: ProzesskostenhilfeRechtschutzversicherungContext,
): boolean {
  return Boolean(
    (context.hasRsvCoverage === "no" || context.hasRsvCoverage === "partly") &&
      (context.hasOrgCoverage === "no" || context.hasOrgCoverage === "partly"),
  );
}
