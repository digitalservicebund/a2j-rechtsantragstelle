import { today } from "~/services/validation/date";

const toGermanDateFormat = (date: Date) => {
  return date.toLocaleDateString("de", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const sevenDaysAgoDate = () => {
  const date = today();
  date.setDate(date.getDate() - 7);
  return toGermanDateFormat(date);
};

export const thirtyDaysAgoDate = () => {
  const date = today();
  date.setDate(date.getDate() - 30);
  return toGermanDateFormat(date);
};
