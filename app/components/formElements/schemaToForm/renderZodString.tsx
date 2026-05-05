import pick from "lodash/pick";
import type { z } from "zod";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import Textarea from "~/components/formElements/inputs/textarea/Textarea";
import DateInput from "../inputs/date/DateInput";
import TimeInput from "../inputs/time/TimeInput";
import AutoSuggestInput from "../inputs/autoSuggest/AutoSuggestInput";
import TextInput, { type InputProps } from "../inputs/text/TextInput";
import NumberInput from "../inputs/number/NumberInput";
import TelephoneInput from "../inputs/telephone/TelephoneInput";

export const isZodString = (
  fieldSchema: z.ZodType,
): fieldSchema is z.ZodString => fieldSchema.def.type === "string";

export const renderZodString = (
  fieldName: string,
  isFieldReadOnly: boolean,
  matchingElement?: StrapiFormComponent,
) => {
  const sharedProps = {
    name: fieldName,
    readonly: isFieldReadOnly,
    label: fieldName, // fallback, will get written if there's a matchingElement
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
      <AutoSuggestInput key={fieldName} {...matchingElement} {...inputProps} />
    );

  const inputType =
    ((inputProps as InputProps).type as
      | "text"
      | "number"
      | "telephone"
      | undefined) ?? "text";

  switch (inputType) {
    case "text":
      return <TextInput key={fieldName} {...inputProps} />;
    case "number":
      return <NumberInput key={fieldName} {...inputProps} />;
    case "telephone":
      return <TelephoneInput key={fieldName} {...inputProps} />;
    default:
      return <TextInput key={fieldName} {...inputProps} />;
  }
};
