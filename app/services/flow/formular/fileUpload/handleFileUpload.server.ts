import { type ValidationErrorResponseData } from "@rvf/react-router";
import { type MergeWithCustomizer } from "lodash";
import { type Session, type SessionData } from "react-router";
import { Result } from "true-myth";
import { parsePathname } from "~/domains/flowIds";
import { type UserData } from "~/domains/userData";
import { resolveArraysFromKeys } from "~/services/array/resolveArraysFromKeys";
import {
  deleteUserFile,
  getUpdatedField,
  uploadUserFile,
} from "~/services/upload/fileUploadHelpers.server";

type OkHandleFileUpload = {
  userData?: UserData;
  mergeCustomizer?: MergeWithCustomizer;
};

const actionFile = (formAction: string) => {
  if (formAction.startsWith("fileUpload")) return "upload";
  if (formAction.startsWith("deleteFile")) return "delete";
  return "unknown";
};

export const handleFileUpload = async (
  formAction: string,
  request: Request,
  flowSession: Session<SessionData, SessionData>,
): Promise<Result<OkHandleFileUpload, ValidationErrorResponseData>> => {
  const { pathname } = new URL(request.url);
  const { flowId } = parsePathname(pathname);

  switch (actionFile(formAction)) {
    case "upload": {
      const { result, error } = await uploadUserFile(
        formAction,
        request,
        flowSession.data,
        flowId,
      );
      if (error) return Result.err(error);

      return Result.ok({
        userData: resolveArraysFromKeys(result!.data),
      });
    }
    case "delete": {
      const { fileWasDeleted } = await deleteUserFile(
        formAction,
        request.headers.get("Cookie"),
        flowSession.data,
        flowId,
      );
      return Result.ok({
        userData: fileWasDeleted
          ? getUpdatedField(formAction.split(".")[1], flowSession.data)
          : undefined,
        mergeCustomizer: (_, newData) => {
          if (Array.isArray(newData)) {
            return newData;
          }
        },
      });
    }
    case "unknown":
      throw new Error(`Unknown file upload action: ${formAction}`);
  }
};
