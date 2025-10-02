import { autocompleteMap } from "~/util/autocompleteMap";
import { useField } from "@rvf/react-router";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { translations } from "~/services/translations/translations";
import classNames from "classnames";

export type SplitDateInputProps = {
  name: string;
};

export const SplitDateInput = ({ name }: SplitDateInputProps) => {
  const dayField = useField(name + ".tag");
  const monthField = useField(name + ".monat");
  const yearField = useField(name + ".jahr");

  const dayError = dayField.error();
  const monthError = monthField.error();
  const yearError = yearField.error();

  const hasError = Boolean(dayError ?? monthError ?? yearError);

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
                {...dayField.getInputProps({
                  id: name + ".tag",
                  inputMode: "numeric",
                })}
                type="number"
                placeholder={
                  translations.splitDateComponent.tagInputPlaceholder.de
                }
                autoComplete={autocompleteMap[name + ".tag"] ?? "off"}
                name={name + ".tag"}
                className={classNames("ds-input w-full", {
                  "has-error": dayError,
                })}
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
                className={classNames("ds-input w-full", {
                  "has-error": monthError,
                })}
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
                className={classNames("ds-input w-full", {
                  "has-error": yearError,
                })}
              />
            </InputLabel>
          </div>
        </div>
        {/* show error messages for each field with error*/}
        {hasError && (
          <div id={errorId}>
            {dayError && <InputError id={errorId}>{dayError}</InputError>}
            {monthError && <InputError id={errorId}>{monthError}</InputError>}
            {yearError && <InputError id={errorId}>{yearError}</InputError>}
          </div>
        )}
        {/* show one error message for one field with error*/}
        {/* {hasError && (
          <div id={errorId}>
            <InputError id={errorId}>{tagError ?? monthError ?? yearError}</InputError>
          </div>
        )} */}
      </div>
    </fieldset>
  );
};

export default SplitDateInput;
