/* eslint-disable sonarjs/deprecation */
import { type ValidationResult } from "@rvf/react-router";
import { withZod } from "@rvf/zod";
import { z, type ZodTypeAny } from "zod";
import { type UserData } from "~/domains/userData";
import { type PDFFileMetadata } from "~/services/validation/pdfFileSchema";

export async function validateUploadedFile(
  inputName: string,
  file: PDFFileMetadata,
  sessionData: UserData,
  schema: Record<string, ZodTypeAny>,
): Promise<ValidationResult<UserData>> {
  return await withZod(z.object(schema)).validate({
    ...sessionData,
    [inputName]: file,
  });
}
