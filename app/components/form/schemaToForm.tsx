import get from "lodash/get";
import { type z } from "zod";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import RadioGroup from "../inputs/RadioGroup";

const enumValuesToRadioGroupOptions = (
  options: string[],
  labels?: Array<Record<"text" | "value", string>>,
) =>
  options.map((value) => ({
    value,
    text: labels?.find((vals) => vals.value === value)?.text ?? value,
  }));

const isZodEnum = (
  fieldSchema: z.ZodTypeAny,
): fieldSchema is z.ZodEnum<[string, ...string[]]> =>
  fieldSchema._def.typeName === "ZodEnum";

export function schemaToFormElement(
  fieldName: string,
  fieldSchema: z.ZodTypeAny,
  formElements?: StrapiFormComponent[],
) {
  const matchingElement = formElements?.find(({ name }) => name === fieldName);

  const label = get(matchingElement, "label", undefined);
  const altLabel = get(matchingElement, "altLabel", undefined);
  const optionLabels = get(matchingElement, "options", undefined);
  const errorMessages = get(matchingElement, "errors")?.flatMap(
    ({ errorCodes }) => errorCodes,
  );

  if (isZodEnum(fieldSchema)) {
    return (
      <RadioGroup
        key={fieldName}
        name={fieldName}
        label={label}
        altLabel={altLabel}
        errorMessages={errorMessages}
        options={enumValuesToRadioGroupOptions(
          fieldSchema.options,
          optionLabels?.filter((option) => "text" in option),
        )}
      />
    );
  }
}
