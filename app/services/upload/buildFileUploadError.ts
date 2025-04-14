import { validationError, type ValidationResult } from "@rvf/remix";
import { type Context } from "~/domains/contexts";

/**
 * Need to remove the validation error's object notation to conform to what the frontend expects
 * i.e. from
 * "belege[0].fileType": "Only PDF and TIFF files allowed"
 * to
 * "belege[0]": "Only PDF and TIFF files allowed"
 *
 * @param validationResult error result returned from `withZod().validate()`
 * @returns DataWithResponseInit
 */
export function buildFileUploadError(
  validationResult: ValidationResult<Context>,
  inputName: string,
) {
  return validationError(
    {
      ...validationResult.error,
      fieldErrors: Object.fromEntries(
        Object.entries(validationResult.error?.fieldErrors ?? {})
          .map(([key, val]) => [key.split(".")[0], val])
          .filter(([key]) => key === inputName),
      ),
    },
    validationResult.submittedData,
  );
}
