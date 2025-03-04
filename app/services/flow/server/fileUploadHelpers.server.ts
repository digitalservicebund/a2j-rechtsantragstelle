import {
  TypedResponse,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import {
  ErrorResult,
  SuccessResult,
  validationError,
  ValidationErrorResponseData,
  ValidationResult,
} from "remix-validated-form";
import { z, ZodTypeAny } from "zod";
import { ArrayData, Context, getContext } from "~/domains/contexts";
import { FlowId } from "~/domains/flowIds";
import { uploadUserFileToS3 } from "~/services/externalDataStorage/storeUserFileToS3Bucket";
import { PDFFileMetadata } from "~/util/file/pdfFileSchema";

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
  const [fieldName, input] = inputName.split("[");
  const inputIndex = input.charAt(0);
  const file = await parseFileFromFormData(request, inputName);
  const fileMeta = convertFileToMetadata(file);
  const scopedContext = Object.fromEntries(
    Object.entries(getContext(flowId)).filter(([key]) => key === fieldName),
  );
  const validationResult = await validateUploadedFile(
    inputName,
    fileMeta,
    userData,
    scopedContext,
  );
  if (validationResult.error) {
    return { validationError: buildFileUploadError(validationResult) };
  }
  const result = await uploadUserFileToS3(
    request.headers.get("Cookie"),
    request.url,
    file,
  );
  fileMeta.etag = result?.ETag?.replaceAll(/"/g, "");
  (validationResult.data[fieldName] as ArrayData)[Number(inputIndex)] =
    fileMeta;
  return { validationResult };
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
export function buildFileUploadError(validationResult: ErrorResult) {
  return validationError(
    {
      ...validationResult.error,
      fieldErrors: Object.fromEntries(
        Object.entries(validationResult.error.fieldErrors).map(([key, val]) => [
          key.split(".")[0],
          val,
        ]),
      ),
    },
    validationResult.submittedData,
  );
}

async function convertAsyncBufferToFile(
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

export function convertFileToMetadata(file?: File): PDFFileMetadata {
  return {
    filename: file?.name ?? "",
    fileType: file?.type ?? "",
    fileSize: file?.size ?? 0,
    createdOn: file?.lastModified
      ? new Date(file?.lastModified).toString()
      : "",
  };
}
