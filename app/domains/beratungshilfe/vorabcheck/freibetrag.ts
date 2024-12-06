import mapValues from "lodash/mapValues";
import { today } from "~/util/date";
import { type AllContexts } from "../../common";

type Freibetraege = {
  incomeAllowance: number;
  partnerAllowance: number;
  dependentAdultAllowance: number;
  children15To18Allowance: number;
  children7To14Allowance: number;
  childrenBelow6Allowance: number;
};

export const BASE_ALLOWANCE = 572;
export const freibetraegePerYear: Record<number, Freibetraege> = {
  2023: {
    incomeAllowance: 251,
    partnerAllowance: 552,
    dependentAdultAllowance: 442,
    children15To18Allowance: 462,
    children7To14Allowance: 383,
    childrenBelow6Allowance: 350,
  },
  2024: {
    incomeAllowance: 282,
    partnerAllowance: 619,
    dependentAdultAllowance: 496,
    children15To18Allowance: 518,
    children7To14Allowance: 429,
    childrenBelow6Allowance: 393,
  },
};

export function getFreibetraege() {
  const currentYear = today().getFullYear();
  const freibetraege = freibetraegePerYear[currentYear];
  if (!freibetraege) {
    console.warn(
      `No Freibeträge for year ${currentYear}, using last valid Freibeträge from ${Object.keys(freibetraegePerYear).at(-1)}`,
    );
    return freibetraegePerYear[currentYear - 1];
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
  let betrag = BASE_ALLOWANCE * 100;
  const {
    incomeAllowance,
    partnerAllowance,
    dependentAdultAllowance,
    children15To18Allowance,
    children7To14Allowance,
    childrenBelow6Allowance,
  } = mapValues(getFreibetraege(), (v) => v * 100);

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
  const { partnerAllowance, incomeAllowance } = getFreibetraege();
  return (
    BASE_ALLOWANCE +
    (working ? incomeAllowance : 0) +
    (partnership ? partnerAllowance : 0) +
    (childrenCount ? childrenCount * 400 : 0)
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
