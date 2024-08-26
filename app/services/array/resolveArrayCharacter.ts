// HTML forms cannot deal with arrays. We use the following char to mark a variable as belonging to an array
// For example: The form field 'accounts#owner' belongs to the object field 'owner' inside the 'accounts' array

import invariant from "tiny-invariant";
import { arrayChar } from ".";

export const resolveArrayCharacter = (
  fieldname: string,
  indices: number | number[],
) => {
  const hashCount = (fieldname.match(/#/g) ?? []).length;
  const arrayIndexes = Array.isArray(indices) ? indices : [indices];
  const indexCount = arrayIndexes.length ?? 0;
  invariant(
    indexCount === hashCount,
    `${fieldname} number of ${arrayChar} (${hashCount}) doesn't match number of indicies (${indexCount})`,
  );
  let updatedFieldname = fieldname;
  arrayIndexes.forEach(
    (index) =>
      (updatedFieldname = updatedFieldname.replace(
        arrayChar,
        `[${String(index)}]`,
      )),
  );
  return updatedFieldname;
};
