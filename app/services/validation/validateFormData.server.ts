import { parseFormData } from "@rvf/react-router";
import { type Context } from "~/domains/contexts";
import { validatorForFieldNames } from "./stepValidator/validatorForFieldNames";

export async function validateFormData(pathname: string, formData: FormData) {
  const formDataKeys = Object.keys(formData);
  const validator = validatorForFieldNames(formDataKeys, pathname);
  return parseFormData<Context>(formData, validator);
}
