import type { Session } from "react-router";
import get from "lodash/get";
import { Result, type Unit } from "true-myth";
import { type FlowId, parsePathname } from "~/domains/flowIds";
import { arrayChar } from "~/services/array";
import { filterFormData } from "~/util/filterFormData";
import { type UserData } from "~/domains/userData";

export function getArrayDataFromFormData(formData: FormData): Result<
  {
    arrayName: string;
    index: number;
    flowId: FlowId;
    pathname: string;
    // Where to send the user back to after deleting (no-JS redirect). For nested
    // items pathname encodes the parent-array index and is not a navigable page,
    // so callers can pass a real page here. Defaults to pathname.
    redirectPathname: string;
    arrayIndexes: number[];
  },
  { message: string }
> {
  const pathname = formData.get("pathnameArrayItem");

  if (!pathname) {
    return Result.err({
      message: "Pathname array item invalid",
    });
  }

  // Underscore-prefixed so filterFormData ignores it, keeping the arrayName/index
  // lookup below unaffected. Read directly, like pathnameArrayItem.
  const redirectPathname = formData.get("_redirectPathname");

  const relevantFormData = filterFormData(formData);
  const [arrayName, indexString] = Object.entries(relevantFormData)[1];
  const index = Number.parseInt(indexString as string);

  if (Number.isNaN(index)) {
    return Result.err({
      message: `Invalided index. Deletion request for ${arrayName}, but index ${indexString as string} is invalid.`,
    });
  }

  const { flowId, arrayIndexes } = parsePathname(pathname as string);

  return Result.ok({
    arrayName,
    index,
    flowId,
    pathname: pathname as string,
    redirectPathname: (redirectPathname as string) || (pathname as string),
    arrayIndexes,
  });
}

export const getArrayForDeletion = (
  userData: UserData,
  arrayName: string,
  arrayIndexes: number[] = [],
) => {
  const segments = arrayName.split(arrayChar);
  const parentCount = segments.length - 1;
  if (arrayIndexes.length < parentCount) {
    return undefined;
  }

  // Only parent segments consume pathname indices; the form supplies the item index.
  const path = segments.map((segment, i) =>
    i < parentCount ? `${segment}[${arrayIndexes[i]}]` : segment,
  );
  const array = get(userData, path.join("."));
  return Array.isArray(array) ? array : undefined;
};

export const deleteArrayItem = (
  arrayName: string,
  index: number,
  flowSession: Session,
  arrayIndexes: number[] = [],
): Result<Unit, { message: string }> => {
  const topLevelArrayName = arrayName.split(arrayChar)[0];
  const newUserData = structuredClone(flowSession.data);
  const targetArray = getArrayForDeletion(newUserData, arrayName, arrayIndexes);

  if (!targetArray) {
    return Result.err({
      message: `Deletion failed: '${arrayName}' is not an array.`,
    });
  }

  if (targetArray.length <= index) {
    return Result.err({
      message: `Requested array isn't long enough. Deletion request at index ${index}, but array is only of length ${targetArray.length}.`,
    });
  }

  targetArray.splice(index, 1);
  flowSession.set(topLevelArrayName, newUserData[topLevelArrayName]);

  return Result.ok();
};
