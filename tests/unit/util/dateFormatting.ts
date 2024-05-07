import { toGermanDateFormat, today } from "~/services/validation/date";

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
