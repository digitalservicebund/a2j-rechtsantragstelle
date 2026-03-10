import { logWarning, sendSentryMessage } from "~/services/logging";

/**
 * Published every year in July.
 *
 * Those who make maintenance payments to others have increased
 * Freibetraege
 */
type PfaendungsFreibetraege = {
  selfAllowance: number;
  allowanceOneDependent: number;
  allowanceTwoDependents: number;
  allowanceThreeDependents: number;
  allowanceFourDependents: number;
  allowanceFiveOrMoreDependents: number;
};

export const pfaendungsbeitraegePerYear: Record<
  number,
  PfaendungsFreibetraege
> = {
  2026: {
    selfAllowance: 1560,
    allowanceOneDependent: 2145.23,
    allowanceTwoDependents: 2471.27,
    allowanceThreeDependents: 2797.31,
    allowanceFourDependents: 3123.35,
    allowanceFiveOrMoreDependents: 3449.39,
  },
};

export const latestPfaendungsfreibetraegeYear = Math.max(
  ...Object.keys(pfaendungsbeitraegePerYear).map(Number),
);

let hasSentPfaendungsFreibetraegeWarning = false;

export function getPfaendungsfreibetraege(year: number) {
  const freibetraege = pfaendungsbeitraegePerYear[year];
  if (!freibetraege) {
    if (!hasSentPfaendungsFreibetraegeWarning) {
      hasSentPfaendungsFreibetraegeWarning = true;
      const message = `No Pfändungsfreibeträge for year ${year}, using last valid Pfändungsfreibeträge from ${latestPfaendungsfreibetraegeYear}`;
      logWarning(message);
      sendSentryMessage(message, "warning");
    }
    return pfaendungsbeitraegePerYear[latestPfaendungsfreibetraegeYear];
  }
  return freibetraege;
}
