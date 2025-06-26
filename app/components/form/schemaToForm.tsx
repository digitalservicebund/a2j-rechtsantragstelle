import get from "lodash/get";
import { type z } from "zod";
import type { StrapiSelectOption } from "~/services/cms/components/StrapiSelect";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import type { StrapiTile } from "~/services/cms/models/StrapiTile";
import Input from "../inputs/Input";
import RadioGroup from "../inputs/RadioGroup";
import TileGroup from "../inputs/tile/TileGroup";
import type { TileOptions } from "../inputs/tile/TileRadio";

type ZodEnum = z.ZodEnum<[string, ...string[]]>;

// TODO: transform in schema?
const enumValuesToRadioGroupOptions = (
  options: string[],
  labels?: StrapiSelectOption[],
) =>
  options.map((value) => ({
    value,
    text: labels?.find((vals) => vals.value === value)?.text ?? value,
  }));

// TODO: transform in schema?
const enumValuesToTileGroupOptions = (
  options: string[],
  labels?: StrapiTile[],
): TileOptions[] =>
  options.map((value) => {
    const matchingLabel = labels?.find((vals) => vals.value === value);
    return {
      value,
      description: matchingLabel?.description,
      image: matchingLabel?.image,
      title: matchingLabel?.title ?? value,
    };
  });

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

  const label = get(matchingElement, "label");
  const errorMessages = get(matchingElement, "errorMessages");

  if (isZodEnum(nestedSchema)) {
    const cmsOptions = get(matchingElement, "options");

    if (matchingElement?.__component === "form-elements.tile-group") {
      return (
        <TileGroup
          key={fieldName}
          name={fieldName}
          useTwoColumns={matchingElement.useTwoColumns}
          label={label}
          errorMessages={errorMessages}
          options={enumValuesToTileGroupOptions(
            nestedSchema.options,
            cmsOptions?.filter((option) => "title" in option),
          )}
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
          cmsOptions?.filter((option) => "text" in option),
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
        width={get(matchingElement, "width")}
        errorMessages={errorMessages}
        helperText={get(matchingElement, "helperText", undefined)}
      />
    );
  }
}
