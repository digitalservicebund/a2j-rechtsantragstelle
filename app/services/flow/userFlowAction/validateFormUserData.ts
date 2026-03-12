import { type ValidatorError } from "@rvf/react-router";
import { Result } from "true-myth";
import { type UserData } from "~/domains/userData";
import { collectArrayFieldsForStep } from "~/domains/pageSchemas";
import { fieldIsArray } from "~/services/array";
import { resolveArrayFieldsFromKeys } from "~/services/array/resolveArrayField";
import { resolveArraysFromKeys } from "~/services/array/resolveArraysFromKeys";
import { getMigrationData } from "~/services/session.server/getMigrationData";
import { validateFormData } from "~/services/validation/validateFormData.server";
import { filterFormData } from "~/util/filterFormData";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";

export const validateFormUserData = async (
  formData: FormData,
  pathname: string,
  cookieHeader: string | null,
): Promise<
  Result<
    { userData: UserData; migrationData: UserData | undefined },
    { error: ValidatorError; submittedData: UserData }
  >
> => {
  const relevantFormData = filterFormData(formData);
  const { arrayIndexes, currentFlow, flowId, stepId } =
    getPageAndFlowDataFromPathname(pathname);

  const [validationResult, migrationData] = await Promise.all([
    validateFormData(pathname, relevantFormData),
    getMigrationData(stepId, flowId, currentFlow, cookieHeader),
  ]);

  if (validationResult?.error) {
    return Result.err({
      error: validationResult.error,
      submittedData: validationResult.submittedData,
    });
  }

  const dataKeys = Object.keys(validationResult?.data ?? {});
  const hasHashFields = dataKeys.some(fieldIsArray);

  // New arrayField approach: if no field uses # and we have array indexes
  if (!hasHashFields && arrayIndexes.length > 0) {
    const arrayFields = collectArrayFieldsForStep(pathname);
    if (arrayFields.length > 0) {
      const resolvedData = resolveArrayFieldsFromKeys(
        validationResult?.data,
        arrayFields,
        arrayIndexes,
      );
      return Result.ok({ userData: resolvedData, migrationData });
    }
  }

  // Legacy # approach
  const resolvedData = resolveArraysFromKeys(
    validationResult?.data,
    arrayIndexes,
  );

  return Result.ok({
    userData: resolvedData,
    migrationData: migrationData,
  });
};
