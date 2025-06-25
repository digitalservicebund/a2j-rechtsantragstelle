import {
  type ValidationErrorResponseData,
  type ValidationResult,
} from "@rvf/react-router";
import { type UserData } from "~/domains/userData";

/**
 * Need to remove the validation error's object notation to conform to what the frontend expects
 * i.e. from
 * "belege[0].fileType": "Only PDF and TIFF files allowed"
 * to
 * "belege[0]": "Only PDF and TIFF files allowed"
 *
 * @param validationResult error result returned from `@rvf/react-router`
 * @returns ValidationErrorResponseData
 */
export function buildFileUploadError(
  validationResult: ValidationResult<UserData>,
  inputName: string,
): ValidationErrorResponseData {
  return {
    fieldErrors: Object.fromEntries(
      Object.entries(validationResult.error?.fieldErrors ?? {})
        .map(([key, val]) => [key.split(".")[0], val])
        .filter(([key]) => key === inputName),
    ),
    repopulateFields: validationResult.submittedData,
  };
}
