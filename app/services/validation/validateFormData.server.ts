import { validatorForFieldNames } from "./stepValidator/validatorForFieldNames";

export async function validateFormData(
  pathname: string,
  formData: Record<string, FormDataEntryValue>,
) {
  const formDataKeys = Object.keys(formData);
  const validator = validatorForFieldNames(formDataKeys, pathname);
  return validator.validate(formData);
}
