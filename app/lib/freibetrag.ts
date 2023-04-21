export function freibetrag(
  working?: boolean,
  partnership?: boolean,
  partnerIncome?: number,
  childrenBelow6?: number,
  children7To14?: number,
  children15To18?: number,
  childrenAbove18?: number,
  childrenIncome?: number
): number {
  let betrag = 552 + 20;

  if (working) betrag += 251;
  if (partnership) betrag += 552;
  if (childrenBelow6) betrag += childrenBelow6 * 350;
  if (children7To14) betrag += children7To14 * 383;
  if (children15To18) betrag += children15To18 * 462;
  if (childrenAbove18) betrag += childrenAbove18 * 442;

  return betrag - ((childrenIncome ?? 0) + (partnerIncome ?? 0));
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
