import type { Session } from "@remix-run/node";
import type { Context, ObjectType } from "~/models/flows/contexts";

export function arrayIndexFromFormData(
  relevantFormData: Record<string, FormDataEntryValue>,
) {
  const [arrayName, indexString] = Object.entries(relevantFormData)[0];
  const index = parseInt(indexString as string);

  if (isNaN(index)) {
    console.error(
      `Deletion request for ${arrayName}, but index ${indexString as string} is invalid.`,
    );
    throw Error("Invalided index");
  }
  return { arrayName, index };
}

export function arrayFromSession(arrayName: string, flowSession: Session) {
  const arrayToMutate = flowSession.get(arrayName) as
    | Context[string]
    | undefined;

  if (!Array.isArray(arrayToMutate)) {
    console.error(`Deletion request for ${arrayName}, but it is not an array.`);
    throw Error("Requested field is not an array");
  }
  return arrayToMutate as ObjectType[];
}

export function deleteFromArrayInplace(array: ObjectType[], index: number) {
  if (array.length <= index) {
    console.error(
      `Deletion request at index ${index}, but array is only of length ${array.length}.`,
    );
    throw Error("Requested array isn't long enough");
  }
  array.splice(index, 1);
}
