import get from "lodash/get";
import type { z } from "zod";
import Checkbox from "~/components/inputs/Checkbox";
import RadioGroup from "~/components/inputs/RadioGroup";
import TileGroup from "~/components/inputs/tile/TileGroup";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

export type ZodEnum = z.ZodEnum<[string, ...string[]]>;

export const isZodEnum = (fieldSchema: z.ZodTypeAny): fieldSchema is ZodEnum =>
  fieldSchema._def.typeName === "ZodEnum";

export function renderZodEnum(
  schema: ZodEnum,
  fieldName: string,
  matchingElement?: StrapiFormComponent,
) {
  const label = get(matchingElement, "label");
  const errorMessages = get(matchingElement, "errorMessages");
  let options = schema.options.map((value) => ({ value, text: value }));
  if (matchingElement?.__component === "form-elements.checkbox") {
    return (
      <Checkbox
        key={fieldName}
        name={fieldName}
        label={label}
        required={matchingElement.required}
        errorMessage={matchingElement.errorMessage}
      />
    );
  }
  if (matchingElement?.__component === "form-elements.tile-group") {
    const cmsOptions = get(matchingElement, "options");
    const cmsObject = Object.fromEntries(
      cmsOptions?.map(({ value, ...rest }) => [value, rest]),
    );
    return (
      <TileGroup
        key={fieldName}
        name={fieldName}
        useTwoColumns={matchingElement.useTwoColumns}
        label={label}
        errorMessages={errorMessages}
        options={options.map(({ value }) => ({
          value,
          description: cmsObject[value]?.description,
          image: cmsObject[value]?.image,
          title: cmsObject[value]?.title ?? value,
        }))}
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
      text: cmsObject[value]?.text ?? text,
    }));
  }

  return (
    <RadioGroup
      key={fieldName}
      name={fieldName}
      label={label}
      altLabel={get(matchingElement, "altLabel")}
      errorMessages={errorMessages}
      options={options}
    />
  );
}
