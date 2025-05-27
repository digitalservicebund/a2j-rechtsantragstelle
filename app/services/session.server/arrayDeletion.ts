import type { Session } from "react-router";
import { type FlowId } from "~/domains/flowIds";
import type { UserData, ObjectType } from "~/domains/userData";
import { getSessionManager, updateSession } from "~/services/session.server";
import { filterFormData } from "~/util/filterFormData";

function arrayIndexFromFormData(relevantFormData: FormData) {
  const [arrayName, indexString] = Object.entries(relevantFormData)[0];
  const index = parseInt(indexString as string);

  if (isNaN(index)) {
    throw Error(
      `Invalided index. Deletion request for ${arrayName}, but index ${indexString as string} is invalid.`,
    );
  }
  return { arrayName, index };
}

function arrayFromSession(arrayName: string, flowSession: Session) {
  const arrayToMutate = flowSession.get(arrayName) as
    | UserData[string]
    | undefined;

  if (!Array.isArray(arrayToMutate)) {
    throw Error(
      `Requested field is not an array. Deletion request for ${arrayName}, but it is not an array.`,
    );
  }
  return arrayToMutate;
}

function deleteFromArrayInplace(array: ObjectType[], index: number) {
  if (array.length <= index) {
    throw Error(
      `Requested array isn't long enough. Deletion request at index ${index}, but array is only of length ${array.length}.`,
    );
  }
  array.splice(index, 1);
}

export async function deleteArrayItem(
  flowId: FlowId,
  formData: FormData,
  request: Request,
): Promise<Response> {
  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);
  const relevantFormData = filterFormData(formData);
  try {
    const { arrayName, index } = arrayIndexFromFormData(relevantFormData);
    const arrayToMutate = arrayFromSession(arrayName, flowSession);
    deleteFromArrayInplace(arrayToMutate, index);
    updateSession(flowSession, { [arrayName]: arrayToMutate });
    const headers = { "Set-Cookie": await commitSession(flowSession) };
    return new Response("success", { status: 200, headers });
  } catch (err) {
    return new Response((err as Error).message, { status: 422 });
  }
}
