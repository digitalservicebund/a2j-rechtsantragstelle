export function getGeburtsdatumDate(dateObj?: {
  tag: number;
  monat: number;
  jahr: number;
}) {
  if (!dateObj?.tag || !dateObj.monat || !dateObj.jahr) {
    return "";
  }
  return `${dateObj.tag}.${dateObj.monat}.${dateObj.jahr}`;
}
