import { parseFormData } from "@rvf/react-router";
import { type UserData } from "~/domains/userData";
import { schemaForFieldNames } from "./stepValidator/schemaForFieldNames";

export async function validateFormData(pathname: string, formData: FormData) {
  const formDataKeys = Object.keys(formData);
  const validator = schemaForFieldNames(formDataKeys, pathname);
  return parseFormData<UserData>(formData, validator);
}
