import pick from "lodash/pick";
import type { z } from "zod";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import Textarea from "~/components/formElements/Textarea";
import TextInput, {
  type InputProps,
} from "~/components/kern/formElements/input/TextInput";
import NumberInput from "~/components/kern/formElements/input/NumberInput";
import TelephoneInput from "~/components/kern/formElements/input/TelephoneInput";
import KernTimeInput from "~/components/kern/formElements/input/KernTimeInput";
import DateInput from "~/components/formElements/inputs/DateInput";
import AutoSuggestInput from "../autoSuggestInput/AutoSuggestInput";

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
    return <KernTimeInput key={fieldName} {...inputProps} />;
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
