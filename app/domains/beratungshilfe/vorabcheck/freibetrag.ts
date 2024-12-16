import mapValues from "lodash/mapValues";
import { today } from "~/util/date";
import { type AllContexts } from "../../common";

type Freibetraege = {
  selfAllowance: number;
  incomeAllowance: number;
  /**
   * Must be the same as self allowance
   */
  partnerAllowance: number;
  dependentAdultAllowance: number;
  children15To18Allowance: number;
  children7To14Allowance: number;
  childrenBelow6Allowance: number;
};

export const SIMPLIFIED_CHILD_ALLOWANCE = 400;
/**
 * Antragstellende Personen are allowed to calculate an additional 20€ on top of the self allowance
 */
export const SELF_ALLOWANCE_BUFFER = 20;

export const freibetraegePerYear: Record<number, Freibetraege> = {
  2023: {
    selfAllowance: 552,
    incomeAllowance: 251,
    partnerAllowance: 552,
    dependentAdultAllowance: 442,
    children15To18Allowance: 462,
    children7To14Allowance: 383,
    childrenBelow6Allowance: 350,
  },
  2024: {
    selfAllowance: 619,
    incomeAllowance: 282,
    partnerAllowance: 619,
    dependentAdultAllowance: 496,
    children15To18Allowance: 518,
    children7To14Allowance: 429,
    childrenBelow6Allowance: 393,
  },
};
export const latestFreibetraegeYear = Math.max(
  ...Object.keys(freibetraegePerYear).map((year) => Number(year)),
);

export function getFreibetraege(year: number) {
  const freibetraege = freibetraegePerYear[year];
  if (!freibetraege) {
    // eslint-disable-next-line no-console
    console.warn(
      `No Freibeträge for year ${year}, using last valid Freibeträge from ${latestFreibetraegeYear}`,
    );
    return freibetraegePerYear[latestFreibetraegeYear];
  }
  return freibetraege;
}

type CalculateFreibetragProps = {
  working: boolean;
  partnership: boolean;
  partnerIncome: number;
  childrenBelow6: number;
  children7To14: number;
  children15To18: number;
  childrenAbove18: number;
  childrenIncome: number;
};

export function calculateFreibetrag({
  working,
  partnership,
  partnerIncome,
  childrenBelow6,
  children7To14,
  children15To18,
  childrenAbove18,
  childrenIncome,
}: Partial<CalculateFreibetragProps>): number {
  const {
    selfAllowance,
    incomeAllowance,
    partnerAllowance,
    dependentAdultAllowance,
    children15To18Allowance,
    children7To14Allowance,
    childrenBelow6Allowance,
  } = mapValues(getFreibetraege(today().getFullYear()), (v) => v * 100);

  let betrag = selfAllowance + SELF_ALLOWANCE_BUFFER * 100;

  if (working) {
    betrag += incomeAllowance;
  }

  if (partnership) {
    betrag += Math.max(partnerAllowance - (partnerIncome ?? 0), 0);
  }

  const childrenFreibetrag =
    (childrenBelow6 ? childrenBelow6 * childrenBelow6Allowance : 0) +
    (children7To14 ? children7To14 * children7To14Allowance : 0) +
    (children15To18 ? children15To18 * children15To18Allowance : 0) +
    (childrenAbove18 ? childrenAbove18 * dependentAdultAllowance : 0);

  betrag += Math.max(childrenFreibetrag - (childrenIncome ?? 0), 0);

  return betrag;
}

function freibetragShort(
  working: boolean,
  partnership: boolean,
  childrenCount: number,
): number {
  const { selfAllowance, partnerAllowance, incomeAllowance } = getFreibetraege(
    today().getFullYear(),
  );
  return (
    selfAllowance +
    SELF_ALLOWANCE_BUFFER +
    (working ? incomeAllowance : 0) +
    (partnership ? partnerAllowance : 0) +
    (childrenCount ? childrenCount * SIMPLIFIED_CHILD_ALLOWANCE : 0)
  );
}

export const getVerfuegbaresEinkommenFreibetrag = (context: AllContexts) => {
  const isWorking =
    "erwerbstaetigkeit" in context && context.erwerbstaetigkeit == "yes";
  const isInPartnership =
    "partnerschaft" in context && context.partnerschaft == "yes";
  const kidsCountTotal =
    "kinderKurz" in context && context.kinderKurz == "yes"
      ? parseFloat(context.kinderAnzahlKurz ?? "0")
      : 0;
  return freibetragShort(isWorking, isInPartnership, kidsCountTotal);
};
