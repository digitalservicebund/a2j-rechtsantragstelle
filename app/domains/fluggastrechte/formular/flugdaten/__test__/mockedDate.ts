import { addDays } from "~/util/date";

export function mockedDate(date: Date) {
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: String(date.getMonth() + 1).padStart(2, "0"),
    year: String(date.getFullYear()),
  };
}
export function daysFromToday(days: number) {
  const today = new Date();
  const targetDate = addDays(today, days);
  return mockedDate(targetDate);
}
