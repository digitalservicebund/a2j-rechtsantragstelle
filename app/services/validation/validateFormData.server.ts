import { parseFormData } from "@rvf/react-router";
import { z } from "zod";
import { getPageSchema } from "~/domains/pages";
import { type UserData } from "~/domains/userData";
import { schemaForFieldNames } from "./stepValidator/schemaForFieldNames";

export async function validateFormData(pathname: string, formData: FormData) {
  const formDataKeys = Object.keys(formData);
  const pageSchema = getPageSchema(pathname);
  const validator = pageSchema
    ? z.object(pageSchema)
    : schemaForFieldNames(formDataKeys, pathname);
  return parseFormData<UserData>(formData, validator);
}
