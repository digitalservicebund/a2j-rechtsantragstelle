export const splitDate = (date: string) => {
  const [day, month, year] = date.split(".");
  return { day, month, year };
};
