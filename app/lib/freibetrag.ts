export function freibetrag({
  working,
  partnership,
  partnerIncome,
  childrenBelow6,
  children7To14,
  children15To18,
  childrenAbove18,
  childrenIncome,
}: {
  working?: boolean;
  partnership?: boolean;
  partnerIncome?: number;
  childrenBelow6?: number;
  children7To14?: number;
  children15To18?: number;
  childrenAbove18?: number;
  childrenIncome?: number;
}): number {
  let betrag = 57200;

  if (working) {
    betrag += 25100;
  }

  if (partnership) {
    betrag += Math.max(55200 - (partnerIncome ?? 0), 0);
  }

  let childrenFreibetrag =
    (Number.isNaN(childrenBelow6) ? 0 : childrenBelow6 ?? 0) * 35000 +
    (Number.isNaN(children7To14) ? 0 : children7To14 ?? 0) * 38300 +
    (Number.isNaN(children15To18) ? 0 : children15To18 ?? 0) * 46200 +
    (Number.isNaN(childrenAbove18) ? 0 : childrenAbove18 ?? 0) * 44200;

  betrag += Math.max(childrenFreibetrag - (childrenIncome ?? 0), 0);

  return betrag;
}

export function freibetragShort(
  working?: boolean,
  partnership?: boolean,
  childrenCount?: number
): number {
  const betrag = 552 + 20;
  return (
    betrag +
    (working ? 251 : 0) +
    (partnership ? 552 : 0) +
    (childrenCount ? childrenCount * 400 : 0)
  );
}
