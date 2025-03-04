import { unstable_parseMultipartFormData } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ErrorResult, validationError } from "remix-validated-form";
import { z } from "zod";
import { Context } from "~/domains/contexts";
import {
  fileUploadErrorMap,
  fileUploadLimit,
  PDFFileMetadata,
  pdfFileMetaDataSchema,
} from "~/util/file/pdfFileSchema";

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
) {
  return await withZod(
    z.object({
      belege: z
        .array(pdfFileMetaDataSchema.optional())
        .max(fileUploadLimit, fileUploadErrorMap.fileLimitReached()),
    }),
  ).validate({
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
