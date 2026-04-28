import get from "lodash/get";
import type { z } from "zod";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { sortSchemaOptionsByFormComponents } from "./sortSchemaOptionsByFormComponents";
import KernRadioGroup from "~/components/formElements/KernRadioGroup";
import KernTile from "~/components/kern/formElements/tile/KernTile";
import KernCheckbox from "~/components/kern/formElements/KernCheckbox";
import KernSelect from "~/components/kern/formElements/KernSelect";

type ZodEnum = z.ZodEnum<Record<string, string>>;

export const isZodEnum = (fieldSchema: z.ZodType): fieldSchema is ZodEnum =>
  fieldSchema.def.type === "enum";

export function renderZodEnum(
  schema: ZodEnum,
  fieldName: string,
  matchingElement?: StrapiFormComponent,
) {
  const label = get(matchingElement, "label");
  const errorMessages = get(matchingElement, "errorMessages");

  const sortedOptions = sortSchemaOptionsByFormComponents(
    schema,
    matchingElement,
  );

  let options = sortedOptions.map((value) => ({ value, text: value }));
  switch (matchingElement?.__component) {
    case "form-elements.checkbox":
      return (
        <KernCheckbox
          key={fieldName}
          name={fieldName}
          label={label}
          required={matchingElement.required}
          errorMessage={matchingElement.errorMessage}
        />
      );
    case "form-elements.tile-group": {
      const cmsOptions = get(matchingElement, "options");
      const cmsObject = Object.fromEntries(
        cmsOptions?.map(({ value, ...rest }) => [value, rest]),
      );
      return (
        <KernTile
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
        <KernSelect
          name={fieldName}
          key={fieldName}
          label={label}
          options={options}
          errorMessages={errorMessages}
          width={get(matchingElement, "width")}
          placeholder={get(matchingElement, "placeholder")}
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
        <KernRadioGroup
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
        <KernRadioGroup
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
