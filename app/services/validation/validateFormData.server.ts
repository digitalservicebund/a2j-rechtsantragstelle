import { parseFormData } from "@rvf/react-router";
import { getPageSchema } from "~/domains/pageSchemas";
import { type UserData } from "~/domains/userData";
import { buildStepSchemaWithPageSchema } from "./stepValidator/buildStepSchemaWithPageSchema";

export async function validateFormData(pathname: string, formData: FormData) {
  const pageSchema = getPageSchema(pathname);
  const validator = buildStepSchemaWithPageSchema(pathname, pageSchema);
  const result = await parseFormData<UserData>(formData, validator);
  return result;
}
