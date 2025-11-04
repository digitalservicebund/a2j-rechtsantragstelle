import { parseFormData } from "@rvf/react-router";
import { getPageSchema } from "~/domains/pageSchemas";
import { type UserData } from "~/domains/userData";
import { schemaForFieldNames } from "./stepValidator/schemaForFieldNames";
import { buildStepSchemaWithPageSchema } from "./stepValidator/buildStepSchemaWithPageSchema";

export async function validateFormData(pathname: string, formData: FormData) {
  const formDataKeys = Object.keys(formData);
  const pageSchema = getPageSchema(pathname);
  const validator = pageSchema
    ? buildStepSchemaWithPageSchema(pathname, pageSchema)
    : schemaForFieldNames(formDataKeys, pathname);
  return parseFormData<UserData>(formData, validator);
}
