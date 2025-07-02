import type { Session } from "react-router";
import { Result, type Unit } from "true-myth";
import { type FlowId, parsePathname } from "~/domains/flowIds";
import type { UserData } from "~/domains/userData";
import { updateSession } from "~/services/session.server";
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
  const index = parseInt(indexString as string);

  if (isNaN(index)) {
    return Result.err({
      message: `Invalided index. Deletion request for ${arrayName}, but index ${indexString as string} is invalid.`,
    });
  }

  const { flowId } = parsePathname(pathname as string);

  return Result.ok({ arrayName, index, flowId, pathname: pathname as string });
}

export const deleteArrayItem = (
  arrayName: string,
  index: number,
  flowSession: Session,
): Result<Unit, { message: string }> => {
  const arrayToMutate = flowSession.get(arrayName) as
    | UserData[string]
    | undefined;

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
  updateSession(flowSession, { [arrayName]: arrayToMutate });
  return Result.ok();
};
