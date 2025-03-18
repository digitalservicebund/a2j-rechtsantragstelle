import { Context } from "~/domains/contexts";
import { validatorForFieldNames } from "./stepValidator/validatorForFieldNames";

export async function validateFormData(pathname: string, formData: Context) {
  const formDataKeys = Object.keys(formData);
  const validator = validatorForFieldNames(formDataKeys, pathname);
  return validator.validate(formData);
}
