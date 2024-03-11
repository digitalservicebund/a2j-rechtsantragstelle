export const arrayChar = "#";
export const splitArrayName = (key: string) => key.split(arrayChar);
export const fieldIsArray = (fieldname: string) =>
  fieldname.includes(arrayChar);
