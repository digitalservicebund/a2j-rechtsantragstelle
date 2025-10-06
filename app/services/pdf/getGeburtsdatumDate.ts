export function getGeburtsdatumDate(dateObj?: {
  day: number;
  month: number;
  year: number;
}) {
  if (!dateObj?.day || !dateObj.month || !dateObj.year) {
    return "";
  }
  return `${dateObj.day}.${dateObj.month}.${dateObj.year}`;
}
