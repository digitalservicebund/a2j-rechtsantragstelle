import type { ProzesskostenhilfeRechtsschutzversicherungContext } from "./context";

export function isOrganizationCoveragePartly(
  context: ProzesskostenhilfeRechtsschutzversicherungContext,
): boolean {
  return Boolean(context.hasOrgCoverage === "partly");
}

export function isOrganizationCoverageNone(
  context: ProzesskostenhilfeRechtsschutzversicherungContext,
): boolean {
  return Boolean(context.hasOrgCoverage === "no");
}
