import pick from "lodash/pick";
import type { z } from "zod";
import AutoSuggestInput from "~/components/inputs/autoSuggestInput/AutoSuggestInput";
import { type AutoSuggestInputProps } from "~/components/inputs/autoSuggestInput/types";
import DateInput from "~/components/inputs/DateInput";
import Input, { type InputProps } from "~/components/inputs/Input";
import Textarea from "~/components/inputs/Textarea";
import TimeInput from "~/components/inputs/TimeInput";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

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

  if (matchingElement?.__component === "form-elements.textarea")
    return (
      <Textarea
        key={fieldName}
        {...sharedProps}
        {...pick(matchingElement, ["details", "description", "maxLength"])}
      />
    );

  const inputProps = {
    ...sharedProps,
    ...pick(matchingElement, ["type", "suffix", "width", "helperText"]),
  } satisfies InputProps;

  if (matchingElement?.__component === "form-elements.date-input")
    return <DateInput key={fieldName} {...inputProps} />;
  if (matchingElement?.__component === "form-elements.time-input")
    return <TimeInput key={fieldName} {...inputProps} />;

  if (matchingElement?.__component === "form-elements.auto-suggest-input")
    return (
      <AutoSuggestInput
        key={fieldName}
        {...inputProps}
        {...(matchingElement as AutoSuggestInputProps)}
      />
    );
  return <Input key={fieldName} {...inputProps} />;
};
