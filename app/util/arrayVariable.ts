// HTML forms cannot deal with arrays. We use the following char to mark a variable as belonging to an array
// For example: The form field 'accounts#owner' belongs to the object field 'owner' inside the 'accounts' array

import invariant from "tiny-invariant";

const arrayChar = "#";
export const splitArrayName = (key: string) => key.split(arrayChar);
export const fieldIsArray = (fieldname: string) =>
  fieldname.includes(arrayChar);
export const toLodashFormat = (fieldname: string, arrayIndexes?: number[]) => {
  invariant(
    (arrayIndexes?.length ?? 0) === (fieldname.match(/#/g) ?? []).length,
    "Invalid fieldname for given array indexes",
  );
  let updatedFieldname = fieldname;
  arrayIndexes?.forEach(
    (index) =>
      (updatedFieldname = updatedFieldname.replace("#", `[${String(index)}]`)),
  );
  return updatedFieldname;
};
