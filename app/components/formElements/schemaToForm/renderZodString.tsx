import pick from "lodash/pick";
import type { z } from "zod";
import DateInput from "~/components/formElements/DateInput";
import Input, { type InputProps } from "~/components/formElements/Input";
import Textarea from "~/components/formElements/Textarea";
import TimeInput from "~/components/formElements/TimeInput";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import NumberIncrement from "~/components/formElements/NumberIncrement";
import KernTextarea from "~/components/kern/formElements/Textarea";
import TextInput from "~/components/kern/formElements/input/TextInput";
import NumberInput from "~/components/kern/formElements/input/NumberInput";
import TelephoneInput from "~/components/kern/formElements/input/TelephoneInput";
import KernDateInput from "~/components/kern/formElements/KernDateInput";
import KernTimeInput from "~/components/kern/formElements/input/KernTimeInput";
import AutoSuggestInput from "../AutoSuggestInput";
import KernAutoSuggestInput from "~/components/kern/formElements/autoSuggest/KernAutoSuggestInput";

export const isZodString = (
  fieldSchema: z.ZodType,
): fieldSchema is z.ZodString => fieldSchema.def.type === "string";

export const renderZodString = (
  fieldName: string,
  matchingElement?: StrapiFormComponent,
  showKernUX?: boolean,
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
    return showKernUX ? (
      <KernTextarea
        key={fieldName}
        {...sharedProps}
        {...pick(matchingElement, ["details", "description", "maxLength"])}
      />
    ) : (
      <Textarea
        key={fieldName}
        {...sharedProps}
        {...pick(matchingElement, ["details", "description", "maxLength"])}
      />
    );
  if (matchingElement?.__component === "form-elements.date-input")
    return showKernUX ? (
      <KernDateInput key={fieldName} {...inputProps} />
    ) : (
      <DateInput key={fieldName} {...inputProps} />
    );
  if (matchingElement?.__component === "form-elements.time-input")
    return showKernUX ? (
      <KernTimeInput key={fieldName} {...inputProps} />
    ) : (
      <TimeInput key={fieldName} {...inputProps} />
    );
  if (matchingElement?.__component === "form-elements.auto-suggest-input")
    return showKernUX ? (
      <KernAutoSuggestInput
        key={fieldName}
        {...matchingElement}
        {...inputProps}
      />
    ) : (
      <AutoSuggestInput key={fieldName} {...matchingElement} {...inputProps} />
    );
  if (matchingElement?.__component === "form-elements.number-increment")
    return <NumberIncrement key={fieldName} {...matchingElement} />;
  // Default fallback for text input

  const inputType =
    ((inputProps as InputProps).type as
      | "text"
      | "number"
      | "telephone"
      | undefined) ?? "text";

  if (showKernUX) {
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
  }
  return <Input key={fieldName} {...inputProps} />;
};
