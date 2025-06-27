import {
  type FieldErrors,
  type ValidationErrorResponseData,
  type ValidationResult,
} from "@rvf/react-router";
import { type UserData } from "~/domains/userData";

function filterFieldErrorsByInputName(
  fieldErrors: FieldErrors,
  inputName: string,
) {
  return Object.fromEntries(
    Object.entries(fieldErrors)
      .map(([key, val]) => [key.split(".")[0], val])
      .filter(([key]) => key === inputName),
  );
}

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
  const fieldErrors = validationResult.error?.fieldErrors ?? {};
  const filteredFieldErrors = filterFieldErrorsByInputName(
    fieldErrors,
    inputName,
  );

  return {
    fieldErrors: filteredFieldErrors,
    repopulateFields: validationResult.submittedData,
  };
}
