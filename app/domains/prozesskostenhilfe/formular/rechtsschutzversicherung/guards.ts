import type { ProzesskostenhilfeRechtsschutzversicherungUserData } from "./userData";

export function isOrganizationCoveragePartly(
  context: ProzesskostenhilfeRechtsschutzversicherungUserData,
): boolean {
  return Boolean(context.hasOrgCoverage === "partly");
}

export function isOrganizationCoverageNone(
  context: ProzesskostenhilfeRechtsschutzversicherungUserData,
): boolean {
  return Boolean(context.hasOrgCoverage === "no");
}
