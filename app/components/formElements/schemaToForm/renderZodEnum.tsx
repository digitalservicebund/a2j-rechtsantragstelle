import get from "lodash/get";
import type { z } from "zod";
import Checkbox from "~/components/formElements/Checkbox";
import RadioGroup from "~/components/formElements/RadioGroup";
import Select from "~/components/formElements/Select";
import TileGroup from "~/components/formElements/tile/TileGroup";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { sortSchemaOptionsByFormComponents } from "./sortSchemaOptionsByFormComponents";
import KernRadioGroup from "~/components/kern/formElements/KernRadioGroup";
import KernTile from "~/components/kern/formElements/tile/KernTile";

type ZodEnum = z.ZodEnum<Record<string, string>>;

export const isZodEnum = (fieldSchema: z.ZodType): fieldSchema is ZodEnum =>
  fieldSchema.def.type === "enum";

export function renderZodEnum(
  schema: ZodEnum,
  fieldName: string,
  matchingElement?: StrapiFormComponent,
  showKernUX?: boolean,
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
        <Checkbox
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
      console.log("showKernUX", showKernUX);
      return showKernUX ? (
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
      ) : (
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
          placeholder={get(matchingElement, "placeholder")}
          altLabel={get(matchingElement, "altLabel")}
          errorMessages={errorMessages}
          width={get(matchingElement, "width")}
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
      return showKernUX ? (
        <KernRadioGroup
          key={fieldName}
          name={fieldName}
          label={label}
          altLabel={get(matchingElement, "altLabel")}
          errorMessages={errorMessages}
          options={options}
        />
      ) : (
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
      return showKernUX ? (
        <KernRadioGroup
          key={fieldName}
          name={fieldName}
          label={label}
          altLabel={get(matchingElement, "altLabel")}
          errorMessages={errorMessages}
          options={options}
        />
      ) : (
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
