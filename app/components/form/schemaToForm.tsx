import get from "lodash/get";
import { type z } from "zod";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import Input from "../inputs/Input";
import RadioGroup from "../inputs/RadioGroup";
import TileGroup from "../inputs/tile/TileGroup";

type ZodEnum = z.ZodEnum<[string, ...string[]]>;

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
    let options = nestedSchema.options.map((value) => ({ value, text: value }));

    if (matchingElement?.__component === "form-elements.tile-group") {
      const cmsOptions = get(matchingElement, "options");
      const cmsObject = Object.fromEntries(
        cmsOptions?.map(({ value, ...rest }) => [value, rest]),
      );
      const tileOptions = options.map(({ value }) => ({
        value,
        description: cmsObject[value]?.description,
        image: cmsObject[value]?.image,
        title: cmsObject[value]?.title ?? value,
      }));

      return (
        <TileGroup
          key={fieldName}
          name={fieldName}
          useTwoColumns={matchingElement.useTwoColumns}
          label={label}
          errorMessages={errorMessages}
          options={tileOptions}
        />
      );
    }

    if (matchingElement?.__component === "form-elements.select") {
      const cmsOptions = get(matchingElement, "options");
      const cmsObject = Object.fromEntries(
        cmsOptions?.map(({ value, ...rest }) => [value, rest]),
      );
      options = options.map(({ value, text }) => ({
        value,
        text: cmsObject[value].text ?? text,
      }));
    }

    return (
      <RadioGroup
        key={fieldName}
        name={fieldName}
        label={label}
        altLabel={get(matchingElement, "altLabel", undefined)}
        errorMessages={errorMessages}
        options={options}
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
