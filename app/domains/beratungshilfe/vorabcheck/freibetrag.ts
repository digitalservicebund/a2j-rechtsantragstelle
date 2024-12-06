import { type AllContexts } from "../../common";

type FreibetragProps = {
  working: boolean;
  partnership: boolean;
  partnerIncome: number;
  childrenBelow6: number;
  children7To14: number;
  children15To18: number;
  childrenAbove18: number;
  childrenIncome: number;
};

export function freibetrag({
  working,
  partnership,
  partnerIncome,
  childrenBelow6,
  children7To14,
  children15To18,
  childrenAbove18,
  childrenIncome,
}: Partial<FreibetragProps>): number {
  let betrag = 57200;

  if (working) {
    betrag += 25100;
  }

  if (partnership) {
    betrag += Math.max(55200 - (partnerIncome ?? 0), 0);
  }

  const childrenFreibetrag =
    (childrenBelow6 ? childrenBelow6 * 35000 : 0) +
    (children7To14 ? children7To14 * 38300 : 0) +
    (children15To18 ? children15To18 * 46200 : 0) +
    (childrenAbove18 ? childrenAbove18 * 44200 : 0);

  betrag += Math.max(childrenFreibetrag - (childrenIncome ?? 0), 0);

  return betrag;
}

function freibetragShort(
  working: boolean,
  partnership: boolean,
  childrenCount: number,
): number {
  const betrag = 552 + 20;
  return (
    betrag +
    (working ? 251 : 0) +
    (partnership ? 552 : 0) +
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
