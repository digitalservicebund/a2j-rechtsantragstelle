export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addYears(date: Date, years: number) {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

export function today() {
  const today = new Date();
  return new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      today.getUTCHours(),
      today.getUTCMinutes(),
    ),
  );
}

export function dateUTCFromGermanDateString(date: string) {
  const [day, month, year] = date.split(".");
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

export const toGermanDateFormat = (date: Date) => {
  return date.toLocaleDateString("de", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function toHourAndMinuteTime(date: Date) {
  const hoursMinuteFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return hoursMinuteFormatter.format(date);
}

export const pdfDateFormat = (date: Date) =>
  date
    .toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replaceAll(".", "_");

// Helper function to convert German date/time format to timestamp
export function convertToTimestamp(date: string, time: string): number {
  const [day, month, year] = date.split(".").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes).getTime();
}
