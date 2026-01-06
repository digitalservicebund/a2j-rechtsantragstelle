import { parsePathname } from "~/domains/flowIds";
import { getMultiFieldsByStepIdValidation } from "./getMultiFieldsByStepIdValidation";
import z from "zod";
import type { SchemaObject } from "~/domains/userData";

export const buildStepSchemaWithPageSchema = (
  pathname: string,
  pageSchema: SchemaObject | undefined,
) => {
  const { flowId, stepId } = parsePathname(pathname);

  const multiFieldsValidation = getMultiFieldsByStepIdValidation(
    flowId,
    stepId,
  );

  const validationFieldsSchema = z.object(pageSchema);

  const validationSchema = multiFieldsValidation
    ? multiFieldsValidation(validationFieldsSchema)
    : validationFieldsSchema;

  return validationSchema;
};
