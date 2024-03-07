// HTML forms cannot deal with arrays. We use the following char to mark a variable as belonging to an array
// For example: The form field 'accounts#owner' belongs to the object field 'owner' inside the 'accounts' array

import invariant from "tiny-invariant";

const arrayChar = "#";
export const splitArrayName = (key: string) => key.split(arrayChar);
export const fieldIsArray = (fieldname: string) =>
  fieldname.includes(arrayChar);

export const interpolateArrayChar = (
  fieldname: string,
  arrayIndexes?: number[],
) => {
  const hashCount = (fieldname.match(/#/g) ?? []).length;
  const indexCount = arrayIndexes?.length ?? 0;
  invariant(
    indexCount === hashCount,
    `${fieldname} number of hashes ${hashCount} doesn't match number of indicies ${indexCount}`,
  );
  let updatedFieldname = fieldname;
  arrayIndexes?.forEach(
    (index) =>
      (updatedFieldname = updatedFieldname.replace("#", `[${String(index)}]`)),
  );
  return updatedFieldname;
};
