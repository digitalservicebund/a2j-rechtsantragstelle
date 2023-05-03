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
  let betrag = 57200;

  if (working) {
    betrag += 25100;
  }

  if (partnership) {
    betrag += 55200;

    if (partnerIncome) {
      const partnerIcomeFreibetrag = Math.max(55200 - partnerIncome, 0);
      betrag -= partnerIcomeFreibetrag;
    }
  }

  let childrenBetrag =
    (childrenBelow6 ?? 0) * 35000 +
    (children7To14 ?? 0) * 38300 +
    (children15To18 ?? 0) * 46200 +
    (childrenAbove18 ?? 0) * 44200;

  if (childrenIncome) {
    const childrenIncomeFreibetrag = Math.max(
      childrenBetrag - childrenIncome,
      0
    );
    betrag -= childrenIncomeFreibetrag;
  }

  return betrag - (childrenIncome ?? 0) - (partnerIncome ?? 0);
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
