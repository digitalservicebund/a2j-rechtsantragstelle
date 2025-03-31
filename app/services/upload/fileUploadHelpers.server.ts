import {
  type TypedResponse,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import pickBy from "lodash/pickBy";
import {
  type ErrorResult,
  type SuccessResult,
  validationError,
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
import {
  convertFileToMetadata,
  splitFieldName,
} from "~/services/upload/fileUploadHelpers";
import { type PDFFileMetadata } from "~/util/file/pdfFileSchema";

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
  const fileMeta = convertFileToMetadata(file);
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
    file,
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

export async function parseFileFromFormData(
  request: Request,
  fieldName: string,
) {
  let file: File | undefined;
  await unstable_parseMultipartFormData(
    request,
    async ({ filename, data, name, contentType }) => {
      if (name !== fieldName || !filename) {
        return "";
      }
      file = await convertAsyncBufferToFile(data, filename, contentType);
      return undefined;
    },
  );
  return file;
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
 * Need to remove the validation error's object notation to conform to what the frontend expects
 * i.e. from
 * "belege[0].fileType": "Only PDF and TIFF files allowed"
 * to
 * "belege[0]": "Only PDF and TIFF files allowed"
 *
 * @param validationResult error result returned from `withZod().validate()`
 * @returns TypedResponse<ValidationErrorResponseData>
 */
export function buildFileUploadError(
  validationResult: ErrorResult,
  inputName: string,
) {
  return validationError(
    {
      ...validationResult.error,
      fieldErrors: Object.fromEntries(
        Object.entries(validationResult.error.fieldErrors)
          .map(([key, val]) => [key.split(".")[0], val])
          .filter(([key]) => key === inputName),
      ),
    },
    validationResult.submittedData,
  );
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

export async function convertAsyncBufferToFile(
  data: AsyncIterable<Uint8Array<ArrayBufferLike>>,
  filename: string,
  contentType: string,
): Promise<File> {
  const dataArr = [];
  for await (const chunk of data) {
    dataArr.push(chunk);
  }
  return new File(dataArr, filename, { type: contentType });
}
