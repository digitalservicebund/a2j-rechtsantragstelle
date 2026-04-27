import { isGeldEinklagenLongTextField } from "~/domains/geldEinklagen/formular/klage-erstellen/longTextFieldConfig";
import { getPageSchema } from "~/domains/pageSchemas";
import type { FieldItems } from "./types";
import { formatCurrencyZodDescription } from "~/services/validation/money/buildMoneyValidationSchema";

export const hasMoneyValidationSchema = (
  pathname: string,
  fieldItems: FieldItems,
) => {
  const pageSchema = getPageSchema(pathname);

  if (!pageSchema) {
    return false;
  }

  return fieldItems.some(({ fieldName }) => {
    const fieldSchema = pageSchema[fieldName];

    if (!fieldSchema) {
      return false;
    }

    return fieldSchema.meta()?.description === formatCurrencyZodDescription;
  });
};

export const hasNonEmptyLongTextField = (fieldItems: FieldItems) =>
  fieldItems.some(
    ({ fieldName, fieldValue }) =>
      isGeldEinklagenLongTextField(fieldName) &&
      typeof fieldValue === "string" &&
      fieldValue.trim().length > 0,
  );
