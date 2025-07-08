/* eslint-disable sonarjs/deprecation */
import { parseFormData } from "@mjackson/form-data-parser";
import { type ValidationErrorResponseData } from "@rvf/react-router";
import { withZod } from "@rvf/zod";
import pickBy from "lodash/pickBy";
import { z, type ZodTypeAny } from "zod";
import { type FlowId } from "~/domains/flowIds";
import { type ArrayData, type UserData, getContext } from "~/domains/userData";
import {
  uploadUserFileToS3,
  deleteUserFileFromS3,
} from "~/services/externalDataStorage/userFileS3Helpers";
import {
  FIFTEEN_MB_IN_BYTES,
  type PDFFileMetadata,
} from "~/services/validation/pdfFileSchema";
import { buildFileUploadError } from "./buildFileUploadError";
import { splitFieldName } from "./splitFieldName";
import { getSessionIdByFlowId } from "../session.server";
import { FILE_REQUIRED_ERROR } from "./constants";

export async function uploadUserFile(
  inputName: string,
  request: Request,
  userData: UserData,
  flowId: FlowId,
): Promise<{
  error?: ValidationErrorResponseData;
  result?: { data: UserData };
}> {
  const { fieldName, inputIndex } = splitFieldName(inputName);
  const formData = await parseFormData(request, {
    maxFileSize: FIFTEEN_MB_IN_BYTES,
  });
  const file = formData.get(inputName) as File | undefined;

  if (!file) {
    return { error: { fieldErrors: { [inputName]: FILE_REQUIRED_ERROR } } };
  }

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

  const validationResult = await withZod(z.object(scopedUserData)).validate({
    ...userData,
    [inputName]: fileMeta,
  });

  if (validationResult.error) {
    return {
      error: buildFileUploadError(validationResult, inputName),
    };
  }

  const sessionId = await getSessionIdByFlowId(
    flowId,
    request.headers.get("Cookie"),
  );
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
  inputName: string,
  cookieHeader: string | null,
  userData: UserData,
  flowId: FlowId,
): Promise<{ fileWasDeleted: boolean }> {
  const { fieldName, inputIndex } = splitFieldName(inputName);
  // Check if a file is saved in Redis; if so, delete it
  const savedFile = (userData[fieldName] as ArrayData | undefined)?.at(
    inputIndex,
  ) as PDFFileMetadata | undefined;
  if (!savedFile?.savedFileKey) return { fileWasDeleted: false };
  const sessionId = await getSessionIdByFlowId(flowId, cookieHeader);
  await deleteUserFileFromS3(sessionId, flowId, savedFile.savedFileKey);
  return { fileWasDeleted: true };
}
