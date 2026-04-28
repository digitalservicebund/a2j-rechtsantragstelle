import type { Session } from "react-router";
import get from "lodash/get";
import { Result, type Unit } from "true-myth";
import { type FlowId, parsePathname } from "~/domains/flowIds";
import { filterFormData } from "~/util/filterFormData";

export function getArrayDataFromFormData(formData: FormData): Result<
  {
    arrayName: string;
    index: number;
    flowId: FlowId;
    pathname: string;
  },
  { message: string }
> {
  const pathname = formData.get("pathnameArrayItem");

  if (!pathname) {
    return Result.err({
      message: "Pathname array item invalid",
    });
  }

  const relevantFormData = filterFormData(formData);
  const [arrayName, indexString] = Object.entries(relevantFormData)[1];
  const index = Number.parseInt(indexString as string);

  if (Number.isNaN(index)) {
    return Result.err({
      message: `Invalided index. Deletion request for ${arrayName}, but index ${indexString as string} is invalid.`,
    });
  }

  const { flowId } = parsePathname(pathname as string);

  return Result.ok({ arrayName, index, flowId, pathname: pathname as string });
}

const buildParentPath = (fieldName: string, indices: number[]) =>
  fieldName
    .split("#")
    .map((segment, i) =>
      i < indices.length ? `${segment}[${indices[i]}]` : segment,
    )
    .join(".");

export const deleteArrayItem = (
  arrayName: string,
  index: number,
  flowSession: Session,
  arrayIndexes: number[] = [],
): Result<Unit, { message: string }> => {
  const topLevelArrayName = arrayName.split("#")[0];
  const parentPath = buildParentPath(arrayName, arrayIndexes);
  const newUserData = structuredClone(flowSession.data);
  const arrayToMutate = get(newUserData, parentPath);

  if (!Array.isArray(arrayToMutate)) {
    return Result.err({
      message: `Deletion failed: '${arrayName}' is not an array.`,
    });
  }

  if (arrayToMutate.length <= index) {
    return Result.err({
      message: `Requested array isn't long enough. Deletion request at index ${index}, but array is only of length ${arrayToMutate.length}.`,
    });
  }

  arrayToMutate.splice(index, 1);
  flowSession.set(topLevelArrayName, newUserData[topLevelArrayName]);

  return Result.ok();
};
