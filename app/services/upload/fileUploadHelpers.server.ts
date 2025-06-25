import { type FileUpload, parseFormData } from "@mjackson/form-data-parser";
import { type ValidationErrorResponseData } from "@rvf/react-router";
import pickBy from "lodash/pickBy";
import { type ZodTypeAny } from "zod";
import { type FlowId } from "~/domains/flowIds";
import { type ArrayData, type UserData, getContext } from "~/domains/userData";
import {
  uploadUserFileToS3,
  deleteUserFileFromS3,
} from "~/services/externalDataStorage/userFileS3Helpers";
import { type PDFFileMetadata } from "~/services/validation/pdfFileSchema";
import { buildFileUploadError } from "./buildFileUploadError";
import { splitFieldName } from "./splitFieldName";
import { validateUploadedFile } from "./validateUploadedFile";
import { getSessionIdByFlowId } from "../session.server";
import { FILE_REQUIRED_ERROR } from "./constants";

export async function uploadUserFile(
  formAction: string,
  request: Request,
  userData: UserData,
  flowId: FlowId,
): Promise<{
  error?: ValidationErrorResponseData;
  result?: { data: UserData };
}> {
  const inputName = formAction.split(".")[1];
  const { fieldName, inputIndex } = splitFieldName(inputName);
  const file = await parseFileFromFormData(request, inputName);

  if (!file) {
    return {
      error: {
        fieldErrors: {
          [formAction.split(".")[1]]: FILE_REQUIRED_ERROR,
        },
      },
    };
  }

  const sessionId = await getSessionIdByFlowId(
    flowId,
    request.headers.get("Cookie"),
  );

  const fileMeta: PDFFileMetadata = {
    filename: file.name,
    fileType: file.type,
    fileSize: file.size,
  };

  /**
   * Need to scope the context, otherwise we validate against the entire context,
   * of which we only have partial data at this point
   */
  const scopedUserData = pickBy(
    getContext(flowId),
    (_val, key) => key === fieldName,
  ) as Record<string, ZodTypeAny>;

  const validationResult = await validateUploadedFile(
    inputName,
    fileMeta,
    userData,
    scopedUserData,
  );

  if (validationResult.error) {
    return {
      error: buildFileUploadError(validationResult, inputName),
    };
  }
  const savedFileKey = await uploadUserFileToS3(
    sessionId,
    flowId,
    await file.arrayBuffer(),
  );

  fileMeta.savedFileKey = savedFileKey;
  (validationResult.data[fieldName] as ArrayData)[Number(inputIndex)] =
    fileMeta;
  return {
    result: { ...validationResult },
  };
}

export async function deleteUserFile(
  formAction: string,
  cookieHeader: string | null,
  userData: UserData,
  flowId: FlowId,
) {
  const inputName = formAction.split(".")[1];
  const { fieldName, inputIndex } = splitFieldName(inputName);
  // Check if a file is saved in Redis; if so, delete it
  const savedFile = (userData[fieldName] as ArrayData | undefined)?.at(
    inputIndex,
  ) as PDFFileMetadata | undefined;
  if (!savedFile?.savedFileKey) return false;
  const sessionId = await getSessionIdByFlowId(flowId, cookieHeader);
  await deleteUserFileFromS3(sessionId, flowId, savedFile.savedFileKey);
  return true;
}

async function parseFileFromFormData(request: Request, fieldName: string) {
  let matchedFile: File | undefined;
  await parseFormData(request, (fileUpload: FileUpload) => {
    if (fileUpload.fieldName === fieldName && fileUpload.name) {
      matchedFile = fileUpload;
    }
  });
  return matchedFile;
}

/**
 * Helper function that deletes an entry in an existing field array
 * @param inputName name of the array that's being modified
 * @param userData existing user data in Context
 */
export function getUpdatedField(
  inputName: string,
  userData: UserData,
): UserData {
  const { fieldName, inputIndex } = splitFieldName(inputName);
  return {
    [fieldName]: (userData[fieldName] as ArrayData).filter(
      (_, index) => index !== inputIndex,
    ),
  };
}
