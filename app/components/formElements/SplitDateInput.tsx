import { autocompleteMap } from "~/util/autocompleteMap";
import { useField } from "@rvf/react-router";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { translations } from "~/services/translations/translations";

export type SplitDateInputProps = {
  name: string;
  legend?: string;
  hintText?: string;
};

export const SplitDateInput = ({
  name,
  legend,
  hintText,
}: SplitDateInputProps) => {
  const tagField = useField(name + ".tag");
  const monthField = useField(name + ".monat");
  const yearField = useField(name + ".jahr");

  const tagError = tagField.error();
  const monthError = monthField.error();
  const yearError = yearField.error();

  const hasError = Boolean(tagError ?? monthError ?? yearError);

  const errorId = `${name}-error`;

  return (
    <fieldset
      className="ds-stack ds-stack-24"
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
      aria-errormessage={hasError ? errorId : undefined}
    >
      <div className="flex flex-col">
        <legend className="ds-body-01-bold mb-16">
          {translations.splitDateComponent.legend.de}
        </legend>
        <p className="ds-label-01-reg mb-24">
          {translations.splitDateComponent.hintText.de}
        </p>

        <div className="grid grid-cols-4 gap-16 w-full">
          <div className="col-span-1">
            <InputLabel id={name + ".tag"}>
              {translations.splitDateComponent.tagInputLabel.de}
              <input
                {...tagField.getInputProps({
                  id: name + ".tag",
                  inputMode: "numeric",
                })}
                type="number"
                placeholder={
                  translations.splitDateComponent.tagInputPlaceholder.de
                }
                autoComplete={autocompleteMap[name + ".tag"] ?? "off"}
                name={name + ".tag"}
                className="ds-input w-full"
              />
            </InputLabel>
          </div>

          <div className="col-span-1">
            <InputLabel id={name + ".monat"}>
              {translations.splitDateComponent.monatInputLabel.de}
              <input
                {...monthField.getInputProps({
                  id: name + ".monat",
                  inputMode: "numeric",
                })}
                type="number"
                placeholder={
                  translations.splitDateComponent.monatInputPlaceholder.de
                }
                autoComplete={autocompleteMap[name + ".monat"] ?? "off"}
                name={name + ".monat"}
                className="ds-input w-full"
              />
            </InputLabel>
          </div>

          <div className="col-span-2">
            <InputLabel id={name + ".jahr"}>
              {translations.splitDateComponent.jahrInputLabel.de}
              <input
                {...yearField.getInputProps({
                  id: name + ".jahr",
                  inputMode: "numeric",
                })}
                type="number"
                placeholder={
                  translations.splitDateComponent.jahrInputPlaceholder.de
                }
                autoComplete={autocompleteMap[name + ".jahr"] ?? "off"}
                name={name + ".jahr"}
                className="ds-input w-full"
              />
            </InputLabel>
          </div>
        </div>

        {hasError && (
          <div id={errorId}>
            {tagError && <InputError id={errorId}>{tagError}</InputError>}
            {monthError && <InputError id={errorId}>{monthError}</InputError>}
            {yearError && <InputError id={errorId}>{yearError}</InputError>}
          </div>
        )}
      </div>
    </fieldset>
  );
};

export default SplitDateInput;
