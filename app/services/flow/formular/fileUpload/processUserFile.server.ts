import { type ValidationErrorResponseData } from "@rvf/react-router";
import { type MergeWithCustomizer } from "lodash";
import { type Session, type SessionData } from "react-router";
import { Result } from "true-myth";
import { parsePathname } from "~/domains/flowIds";
import { type UserData } from "~/domains/userData";
import {
  deleteUserFile,
  uploadUserFile,
} from "~/services/upload/fileUploadHelpers.server";

type OkProcessUserFile = {
  userData?: UserData;
  mergeCustomizer?: MergeWithCustomizer;
};

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
      return Result.ok({ userData: result.userData });
    }
    case "deleteFile": {
      const userData = await deleteUserFile(
        inputName,
        request.headers.get("Cookie"),
        flowSession.data,
        flowId,
      );
      return Result.ok({
        userData,
        mergeCustomizer: (_, newData) =>
          Array.isArray(newData) ? newData : undefined,
      });
    }
    default:
      throw new Error(`Unknown file upload action: ${formAction}`);
  }
};
