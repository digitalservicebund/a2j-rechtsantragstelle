import { type ValidatorError } from "@rvf/react-router";
import { Result } from "true-myth";
import { type UserData } from "~/domains/userData";
import { resolveArraysFromKeys } from "~/services/array/resolveArraysFromKeys";
import { validateFormData } from "~/services/validation/validateFormData.server";
import { filterFormData } from "~/util/filterFormData";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";

export const validateFormUserData = async (
  formData: FormData,
  pathname: string,
): Promise<
  Result<
    { userData: UserData },
    { error: ValidatorError; submittedData: UserData }
  >
> => {
  const relevantFormData = filterFormData(formData);
  const { arrayIndexes } = getPageAndFlowDataFromPathname(pathname);

  const validationResult = await validateFormData(pathname, relevantFormData);

  if (validationResult?.error) {
    return Result.err({
      error: validationResult.error,
      submittedData: validationResult.submittedData,
    });
  }

  const resolvedData = resolveArraysFromKeys(
    validationResult?.data,
    arrayIndexes,
  );

  return Result.ok({
    userData: resolvedData,
  });
};
