import type { Session } from "@remix-run/node";
import type { Context, ObjectType } from "~/domains/contexts";

export function arrayIndexFromFormData(
  relevantFormData: Record<string, FormDataEntryValue>,
) {
  const [arrayName, indexString] = Object.entries(relevantFormData)[0];
  const index = parseInt(indexString as string);

  if (isNaN(index)) {
    throw Error(
      `Invalided index. Deletion request for ${arrayName}, but index ${indexString as string} is invalid.`,
    );
  }
  return { arrayName, index };
}

export function arrayFromSession(arrayName: string, flowSession: Session) {
  const arrayToMutate = flowSession.get(arrayName) as
    | Context[string]
    | undefined;

  if (!Array.isArray(arrayToMutate)) {
    throw Error(
      `Requested field is not an array. Deletion request for ${arrayName}, but it is not an array.`,
    );
  }
  return arrayToMutate;
}

export function deleteFromArrayInplace(array: ObjectType[], index: number) {
  if (array.length <= index) {
    throw Error(
      `Requested array isn't long enough. Deletion request at index ${index}, but array is only of length ${array.length}.`,
    );
  }
  array.splice(index, 1);
}
