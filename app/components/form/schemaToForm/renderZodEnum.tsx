import get from "lodash/get";
import type { z } from "zod";
import Checkbox from "~/components/inputs/Checkbox";
import RadioGroup from "~/components/inputs/RadioGroup";
import Select from "~/components/inputs/Select";
import TileGroup from "~/components/inputs/tile/TileGroup";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

export type ZodEnum = z.ZodEnum<Record<string, string>>;

export const isZodEnum = (fieldSchema: z.ZodType): fieldSchema is ZodEnum =>
  fieldSchema.def.type === "enum";

export function renderZodEnum(
  schema: ZodEnum,
  fieldName: string,
  matchingElement?: StrapiFormComponent,
) {
  const label = get(matchingElement, "label");
  const errorMessages = get(matchingElement, "errorMessages");
  let options = schema.options.map((value) => ({ value, text: value }));
  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (matchingElement?.__component) {
    case "form-elements.checkbox":
      return (
        <Checkbox
          key={fieldName}
          name={fieldName}
          label={label}
          errorMessage={matchingElement.errorMessage}
        />
      );
    case "form-elements.tile-group": {
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
    case "form-elements.dropdown": {
      const cmsOptions = get(matchingElement, "options");
      const cmsObject = Object.fromEntries(
        cmsOptions?.map(({ value, ...rest }) => [value, rest]),
      );
      options = options.map(({ value, text }) => ({
        value,
        text: cmsObject[value]?.text ?? text,
      }));
      return (
        <Select
          name={fieldName}
          key={fieldName}
          label={label}
          options={options}
          altLabel={get(matchingElement, "altLabel")}
          errorMessages={errorMessages}
        />
      );
    }
    case "form-elements.select":
      {
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
    default:
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
}
