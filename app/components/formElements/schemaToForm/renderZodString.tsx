import pick from "lodash/pick";
import type { z } from "zod";
import DateInput from "~/components/formElements/DateInput";
import Input, { type InputProps } from "~/components/formElements/Input";
import Textarea from "~/components/formElements/Textarea";
import TimeInput from "~/components/formElements/TimeInput";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import AutoSuggestInput from "../AutoSuggestInput";

export const isZodString = (
  fieldSchema: z.ZodType,
): fieldSchema is z.ZodString => fieldSchema.def.type === "string";

export const renderZodString = (
  schema: z.ZodString,
  fieldName: string,
  matchingElement?: StrapiFormComponent,
) => {
  const sharedProps = {
    name: fieldName,
    ...pick(matchingElement, ["label", "placeholder", "errorMessages"]),
  };

  const inputProps = {
    ...sharedProps,
    ...pick(matchingElement, ["type", "suffix", "width", "helperText"]),
  } satisfies InputProps;

  if (matchingElement?.__component === "form-elements.textarea")
    return (
      <Textarea
        key={fieldName}
        {...sharedProps}
        {...pick(matchingElement, ["details", "description", "maxLength"])}
      />
    );
  if (matchingElement?.__component === "form-elements.date-input")
    return <DateInput key={fieldName} {...inputProps} />;
  if (matchingElement?.__component === "form-elements.time-input")
    return <TimeInput key={fieldName} {...inputProps} />;
  if (matchingElement?.__component === "form-elements.auto-suggest-input")
    return (
      <AutoSuggestInput key={fieldName} {...matchingElement} name={fieldName} />
    );
  return <Input key={fieldName} {...inputProps} />;
};
