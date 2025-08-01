import get from "lodash/get";
import type { z } from "zod";
import Input from "~/components/inputs/Input";
import Textarea from "~/components/inputs/Textarea";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

export const isZodString = (
  fieldSchema: z.ZodType,
): fieldSchema is z.ZodString => fieldSchema.def.type === "string";

export const renderZodString = (
  schema: z.ZodString,
  fieldName: string,
  matchingElement?: StrapiFormComponent,
) => {
  if (matchingElement?.__component === "form-elements.textarea")
    return (
      <Textarea
        key={fieldName}
        name={fieldName}
        details={matchingElement.details}
        description={matchingElement.description}
        label={matchingElement.label}
        placeholder={matchingElement.placeholder}
        maxLength={matchingElement.maxLength}
        errorMessages={matchingElement.errorMessages}
      />
    );
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
