import get from "lodash/get";
import type { z } from "zod";
import DateInput from "~/components/inputs/DateInput";
import Input from "~/components/inputs/Input";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

export const isZodString = (
  fieldSchema: z.ZodType,
): fieldSchema is z.ZodString => fieldSchema.def.type === "string";

export const renderZodString = (
  _schema: z.ZodString,
  fieldName: string,
  matchingElement?: StrapiFormComponent,
) => {
  if (matchingElement?.__component === "form-elements.date-input") {
    return <DateInput {...matchingElement} key={fieldName} name={fieldName} />;
  }
  return (
    <Input
      key={fieldName}
      name={fieldName}
      type={get(matchingElement, "type")}
      label={get(matchingElement, "label")}
      suffix={get(matchingElement, "suffix")}
      placeholder={get(matchingElement, "placeholder")}
      width={get(matchingElement, "width")}
      errorMessages={get(matchingElement, "errorMessages")}
      helperText={get(matchingElement, "helperText")}
    />
  );
};
