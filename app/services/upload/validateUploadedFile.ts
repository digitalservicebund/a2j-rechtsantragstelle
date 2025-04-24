/* eslint-disable sonarjs/deprecation */
import { type ValidationResult } from "@rvf/react-router";
import { withZod } from "@rvf/zod";
import { z, type ZodTypeAny } from "zod";
import { type Context } from "~/domains/contexts";
import { type PDFFileMetadata } from "~/util/file/pdfFileSchema";

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
