export function getGeburtsdatumDate(dateObj?: {
  tag: string;
  monat: string;
  jahr: string;
}) {
  if (!dateObj?.tag || !dateObj.monat || !dateObj.jahr) {
    return "";
  }
  return `${dateObj.tag}.${dateObj.monat}.${dateObj.jahr}`;
}
