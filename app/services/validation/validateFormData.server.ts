import { parseFormData } from "@rvf/react-router";
import { z } from "zod";
import { getPageSchema } from "~/domains/pageSchemas";
import { type UserData } from "~/domains/userData";
import { schemaForFieldNames } from "./stepValidator/schemaForFieldNames";

export async function validateFormData(pathname: string, formData: FormData) {
  const formDataKeys = Object.keys(formData);
  const pageSchema = getPageSchema(pathname);
  const validator = pageSchema
    ? z.object(pageSchema)
    : schemaForFieldNames(formDataKeys, pathname);
  // @ts-expect-error TS cannot prove that a generic validator returns data that conforms to UserData. We should fix SchemaObject to be more precise
  return parseFormData<UserData>(formData, validator);
}
