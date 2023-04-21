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
  let betrag = 572;

  if (working) {
    betrag += 251;
  }

  if (partnership) {
    betrag += 552;

    if (partnerIncome) {
      const partnerIcomeFreibetrag = Math.max(552 - partnerIncome, 0);
      betrag -= partnerIcomeFreibetrag;
    }
  }

  let childrenBetrag =
    (childrenBelow6 ?? 0) * 350 +
    (children7To14 ?? 0) * 383 +
    (children15To18 ?? 0) * 462 +
    (childrenAbove18 ?? 0) * 442;

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
