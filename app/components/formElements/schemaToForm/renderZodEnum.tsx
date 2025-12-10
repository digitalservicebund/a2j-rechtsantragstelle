import get from "lodash/get";
import type { z } from "zod";
import Checkbox from "~/components/formElements/Checkbox";
import RadioGroup from "~/components/formElements/RadioGroup";
import Select from "~/components/formElements/Select";
import TileGroup from "~/components/formElements/tile/TileGroup";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";

type ZodEnum = z.ZodEnum<Record<string, string>>;

export const isZodEnum = (fieldSchema: z.ZodType): fieldSchema is ZodEnum =>
  fieldSchema.def.type === "enum";

const filterOptions = {
  ["/fluggastrechte/formular/flugdaten/verspaeteter-flug-1"]: [
    "startAirportFirstZwischenstopp",
    "firstZwischenstoppEndAirport",
  ],
  ["/fluggastrechte/formular/flugdaten/verspaeteter-flug-2"]: [
    "startAirportFirstZwischenstopp",
    "firstAirportSecondZwischenstopp",
    "secondZwischenstoppEndAirport",
  ],
  ["/fluggastrechte/formular/flugdaten/verspaeteter-flug-3"]: [
    "startAirportFirstZwischenstopp",
    "firstAirportSecondZwischenstopp",
    "secondAirportThirdZwischenstopp",
    "thirdZwischenstoppEndAirport",
  ],
};

/**
 * Workaround to migrate the FGR Formular to Page Schemas.
 * The field verspaeteterFlug uses different options across multiple pages,
 * and we cannot remove it from the Page Schemas configuration due to issues with type object creation.
 * TODO: We plan to rename this field in the Flow soon and remove the temporary filter function.
 * */
const filterOption = (option: string, fieldName: string, pathname: string) => {
  if (fieldName !== "verspaeteterFlug" || !(pathname in filterOptions)) {
    return true;
  }

  const fieldAvailableOptions =
    filterOptions[pathname as keyof typeof filterOptions];

  return fieldAvailableOptions.includes(option);
};

export function renderZodEnum(
  schema: ZodEnum,
  fieldName: string,
  pathname: string,
  matchingElement?: StrapiFormComponent,
) {
  const label = get(matchingElement, "label");
  const errorMessages = get(matchingElement, "errorMessages");
  let options = schema.options
    .map((value) => ({ value, text: value }))
    .filter(({ value }) => filterOption(value, fieldName, pathname));
  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
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
