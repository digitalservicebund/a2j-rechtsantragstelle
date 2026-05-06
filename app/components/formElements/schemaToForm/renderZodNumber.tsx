import pick from "lodash/pick";
import { type z } from "zod";
import NumberIncrement from "~/components/formElements/inputs/number/NumberIncrement";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";

export const isZodNumber = (
  fieldSchema: z.ZodType,
): fieldSchema is z.ZodNumber => fieldSchema.def.type === "number";

export const renderZodNumber = (
  fieldName: string,
  fieldSchema: z.ZodNumber,
  matchingElement?: StrapiFormComponent,
) => {
  const inputProps = {
    name: fieldName,
    label: fieldName, // fallback, will get written if there's a matchingElement
    ...pick(matchingElement, ["label", "errorMessages"]),
  };
  if (matchingElement?.__component === "form-elements.number-increment") {
    return (
      <NumberIncrement
        key={fieldName}
        min={fieldSchema.minValue ?? undefined}
        max={fieldSchema.maxValue ?? undefined}
        {...inputProps}
      />
    );
  }
};
