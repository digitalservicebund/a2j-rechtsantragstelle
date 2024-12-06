import mapValues from "lodash/mapValues";
import { today } from "~/util/date";
import { type AllContexts } from "../../common";

type FreibetragFunctionProps = {
  working: boolean;
  partnership: boolean;
  partnerIncome: number;
  numChildrenBelow6: number;
  numChildren7To14: number;
  numChildren15To18: number;
  numChildrenAbove18: number;
  childrenIncome: number;
};

type Freibetraege = {
  income: number;
  partner: number;
  dependentAdults: number;
  children15To18: number;
  children7To14: number;
  childrenBelow6: number;
};

export const BASE_SUM = 572;
export const freibetragPerYear: Record<number, Freibetraege> = {
  2023: {
    income: 251,
    partner: 552,
    dependentAdults: 442,
    children15To18: 462,
    children7To14: 383,
    childrenBelow6: 350,
  },
  2024: {
    income: 282,
    partner: 619,
    dependentAdults: 496,
    children15To18: 518,
    children7To14: 429,
    childrenBelow6: 393,
  },
};

export function getFreibetraege() {
  const currentYear = today().getFullYear();
  const freibetraege = freibetragPerYear[currentYear];
  if (!freibetraege) {
    console.warn(
      `No Freibeträge for year ${currentYear}, using last valid Freibeträge from ${Object.keys(freibetragPerYear).at(-1)}`,
    );
    return freibetragPerYear[currentYear - 1];
  }
  return freibetraege;
}

export function freibetrag({
  working,
  partnership,
  partnerIncome,
  numChildrenBelow6,
  numChildren7To14,
  numChildren15To18,
  numChildrenAbove18,
  childrenIncome,
}: Partial<FreibetragFunctionProps>): number {
  let betrag = BASE_SUM * 100;
  const {
    income,
    partner,
    dependentAdults,
    children15To18,
    children7To14,
    childrenBelow6,
  } = mapValues(getFreibetraege(), (v) => v * 100);

  if (working) {
    betrag += income;
  }

  if (partnership) {
    betrag += Math.max(partner - (partnerIncome ?? 0), 0);
  }

  const childrenFreibetrag =
    (numChildrenBelow6 ? numChildrenBelow6 * childrenBelow6 : 0) +
    (numChildren7To14 ? numChildren7To14 * children7To14 : 0) +
    (numChildren15To18 ? numChildren15To18 * children15To18 : 0) +
    (numChildrenAbove18 ? numChildrenAbove18 * dependentAdults : 0);

  betrag += Math.max(childrenFreibetrag - (childrenIncome ?? 0), 0);

  return betrag;
}

function freibetragShort(
  working: boolean,
  partnership: boolean,
  childrenCount: number,
): number {
  const { partner, income } = getFreibetraege();
  return (
    BASE_SUM +
    (working ? income : 0) +
    (partnership ? partner : 0) +
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
