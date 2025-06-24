import get from "lodash/get";
import { type z } from "zod";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { strapiWidthToFieldWidth } from "~/services/cms/models/strapiWidth";
import Input from "../inputs/Input";
import RadioGroup from "../inputs/RadioGroup";
import TileGroup from "../inputs/tile/TileGroup";

type ZodEnum = z.ZodEnum<[string, ...string[]]>;

const enumValuesToRadioGroupOptions = (
  options: string[],
  labels?: Array<Record<"text" | "value", string>>,
) =>
  options.map((value) => ({
    value,
    text: labels?.find((vals) => vals.value === value)?.text ?? value,
  }));

const isZodEnum = (fieldSchema: z.ZodTypeAny): fieldSchema is ZodEnum =>
  fieldSchema._def.typeName === "ZodEnum";

const isZodString = (fieldSchema: z.ZodTypeAny): fieldSchema is ZodEnum =>
  fieldSchema._def.typeName === "ZodString";

const getNestedSchema = (schema: z.ZodTypeAny): ZodEnum | z.ZodString => {
  return schema._def.typeName === "ZodEffects"
    ? getNestedSchema(schema._def.schema)
    : (schema as ZodEnum | z.ZodString);
};

export function schemaToFormElement(
  fieldName: string,
  fieldSchema: z.ZodTypeAny,
  formElements?: StrapiFormComponent[],
) {
  const nestedSchema = getNestedSchema(fieldSchema);
  const matchingElement = formElements?.find(({ name }) => name === fieldName);

  const label = get(matchingElement, "label", undefined);
  const errorMessages = get(matchingElement, "errors")?.flatMap(
    ({ errorCodes }) => errorCodes,
  );

  if (isZodEnum(nestedSchema)) {
    const optionLabels = get(matchingElement, "options", undefined);

    if (matchingElement?.__component === "form-elements.tile-group") {
      const options = enumValuesToRadioGroupOptions(
        nestedSchema.options,
        optionLabels?.filter((option) => "text" in option),
      );
      return (
        <TileGroup
          key={fieldName}
          name={fieldName}
          label={label}
          errorMessages={errorMessages}
          options={options}
        />
      );
    }

    return (
      <RadioGroup
        key={fieldName}
        name={fieldName}
        label={label}
        altLabel={get(matchingElement, "altLabel", undefined)}
        errorMessages={errorMessages}
        options={enumValuesToRadioGroupOptions(
          nestedSchema.options,
          optionLabels?.filter((option) => "text" in option),
        )}
      />
    );
  }

  if (isZodString(nestedSchema)) {
    return (
      <Input
        key={fieldName}
        name={fieldName}
        type={get(matchingElement, "type", undefined)}
        label={label}
        suffix={get(matchingElement, "suffix", undefined)}
        placeholder={get(matchingElement, "placeholder", undefined)}
        width={strapiWidthToFieldWidth(get(matchingElement, "width", null))} // TODO: transform in schema?
        errorMessages={errorMessages}
        helperText={get(matchingElement, "helperText", undefined)}
      />
    );
  }
}
