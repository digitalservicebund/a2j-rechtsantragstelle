import { type FileUpload, parseFormData } from "@mjackson/form-data-parser";
import { type TypedResponse } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import pickBy from "lodash/pickBy";
import {
  type SuccessResult,
  type ValidationErrorResponseData,
  type ValidationResult,
} from "remix-validated-form";
import { z, type ZodTypeAny } from "zod";
import { type ArrayData, type Context, getContext } from "~/domains/contexts";
import { type FlowId } from "~/domains/flowIds";
import {
  uploadUserFileToS3,
  deleteUserFileFromS3,
} from "~/services/externalDataStorage/userFileS3Helpers";
import { splitFieldName } from "~/services/upload/fileUploadHelpers";
import { type PDFFileMetadata } from "~/util/file/pdfFileSchema";
import { buildFileUploadError } from "./buildFileUploadError";

export async function uploadUserFile(
  formAction: string,
  request: Request,
  userData: Context,
  flowId: FlowId,
): Promise<{
  validationError?: TypedResponse<ValidationErrorResponseData>;
  validationResult?: SuccessResult<Context>;
}> {
  const inputName = formAction.split(".")[1];
  const { fieldName, inputIndex } = splitFieldName(inputName);
  const file = await parseFileFromFormData(request, inputName);
  const fileArrayBuffer = await file?.arrayBuffer();
  const fileMeta: PDFFileMetadata = {
    filename: file?.name ?? "",
    fileType: file?.type ?? "",
    fileSize: fileArrayBuffer ? fileArrayBuffer.byteLength : 0,
  };
  /**
   * Need to scope the context, otherwise we validate against the entire context,
   * of which we only have partial data at this point
   */
  const scopedContext = pickBy(
    getContext(flowId),
    (_val, key) => key === fieldName,
  ) as Record<string, ZodTypeAny>;
  const validationResult = await validateUploadedFile(
    inputName,
    fileMeta,
    userData,
    scopedContext,
  );
  if (validationResult.error) {
    return {
      validationError: buildFileUploadError(validationResult, inputName),
    };
  }
  const savedFileKey = await uploadUserFileToS3(
    request.headers.get("Cookie"),
    flowId,
    fileArrayBuffer,
  );

  fileMeta.savedFileKey = savedFileKey;
  (validationResult.data[fieldName] as ArrayData)[Number(inputIndex)] =
    fileMeta;
  return { validationResult };
}

export async function deleteUserFile(
  formAction: string,
  cookieHeader: string | null,
  userData: Context,
  flowId: FlowId,
) {
  const inputName = formAction.split(".")[1];
  const { fieldName, inputIndex } = splitFieldName(inputName);
  // Check if a file is saved in Redis; if so, delete it
  const savedFile = (userData[fieldName] as ArrayData | undefined)?.at(
    inputIndex,
  ) as PDFFileMetadata | undefined;
  if (savedFile) {
    await deleteUserFileFromS3(cookieHeader, flowId, savedFile.savedFileKey!);
    return true;
  }
  return false;
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

export async function validateUploadedFile(
  inputName: string,
  file: PDFFileMetadata,
  sessionData: Context,
  schema: Record<string, ZodTypeAny>,
): Promise<ValidationResult<Context>> {
  return await withZod(z.object(schema)).validate({
    ...sessionData,
    [inputName]: file,
  });
}

/**
 * Helper function that deletes an entry in an existing field array
 * @param inputName name of the array that's being modified
 * @param userData existing user data in Context
 */
export function getUpdatedField(inputName: string, userData: Context): Context {
  const { fieldName, inputIndex } = splitFieldName(inputName);
  return {
    [fieldName]: (userData[fieldName] as ArrayData).filter(
      (_, index) => index !== inputIndex,
    ),
  };
}
