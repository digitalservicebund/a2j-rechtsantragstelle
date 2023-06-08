export function stripLeadingZeros(s?: string) {
  return s ? s.replace(/^0+/, "") : "";
}
