import { type ValidationErrorResponseData } from "@rvf/react-router";
import { type MergeWithCustomizer } from "lodash";
import { type Session, type SessionData } from "react-router";
import { Result } from "true-myth";
import { parsePathname } from "~/domains/flowIds";
import { type ArrayData, type UserData } from "~/domains/userData";
import { resolveArraysFromKeys } from "~/services/array/resolveArraysFromKeys";
import {
  deleteUserFile,
  uploadUserFile,
} from "~/services/upload/fileUploadHelpers.server";
import { splitFieldName } from "~/services/upload/splitFieldName";

type OkProcessUserFile = {
  userData?: UserData;
  mergeCustomizer?: MergeWithCustomizer;
};

/**
 * Helper function that deletes an entry in an existing field array
 * @param inputName name of the array that's being modified
 * @param userData existing user data in Context
 */
function getUpdatedField(inputName: string, userData: UserData): UserData {
  const { fieldName, inputIndex } = splitFieldName(inputName);
  return {
    [fieldName]: (userData[fieldName] as ArrayData).filter(
      (_, index) => index !== inputIndex,
    ),
  };
}

export const processUserFile = async (
  formAction: string,
  request: Request,
  flowSession: Session<SessionData, SessionData>,
): Promise<Result<OkProcessUserFile, ValidationErrorResponseData>> => {
  const { pathname } = new URL(request.url);
  const { flowId } = parsePathname(pathname);
  const [action, inputName] = formAction.split(".");

  switch (action) {
    case "fileUpload": {
      const result = await uploadUserFile(inputName, request, flowId);
      if ("fieldErrors" in result) return Result.err(result);
      return Result.ok({ userData: resolveArraysFromKeys(result.data) });
    }
    case "deleteFile": {
      const success = await deleteUserFile(
        inputName,
        request.headers.get("Cookie"),
        flowSession.data,
        flowId,
      );
      return Result.ok({
        userData: success
          ? getUpdatedField(inputName, flowSession.data)
          : undefined,
        mergeCustomizer: (_, newData) =>
          Array.isArray(newData) ? newData : undefined,
      });
    }
    default:
      throw new Error(`Unknown file upload action: ${formAction}`);
  }
};
