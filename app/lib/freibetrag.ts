export function freibetrag(
  working: boolean,
  partnership: boolean,
  childrenBelow6?: number,
  children7To14?: number,
  children15To18?: number,
  childrenAbove18?: number
): number {
  let betrag = 552;
  if (working) betrag += 251;
  if (partnership) betrag += 552;
  if (childrenBelow6) betrag += childrenBelow6 * 350;
  if (children7To14) betrag += children7To14 * 383;
  if (children15To18) betrag += children15To18 * 462;
  if (childrenAbove18) betrag += childrenAbove18 * 442;
  return betrag;
}
