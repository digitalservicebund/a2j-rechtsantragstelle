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
  const day = name + ".day";
  const month = name + ".month";
  const year = name + ".year";

  const dayField = useField(day);
  const monthField = useField(month);
  const yearField = useField(year);

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
            <InputLabel id={day}>
              {translations.splitDateComponent.tagInputLabel.de}
              <input
                {...dayField.getInputProps({
                  id: day,
                  inputMode: "numeric",
                })}
                type="number"
                placeholder={
                  translations.splitDateComponent.tagInputPlaceholder.de
                }
                autoComplete={autocompleteMap[day] ?? "off"}
                name={day}
                className={classNames("ds-input w-full", {
                  "has-error": dayError,
                })}
                aria-required="true"
              />
            </InputLabel>
          </div>

          <div className="col-span-1">
            <InputLabel id={month}>
              {translations.splitDateComponent.monatInputLabel.de}
              <input
                {...monthField.getInputProps({
                  id: month,
                  inputMode: "numeric",
                })}
                type="number"
                placeholder={
                  translations.splitDateComponent.monatInputPlaceholder.de
                }
                autoComplete={autocompleteMap[month] ?? "off"}
                name={month}
                className={classNames("ds-input w-full", {
                  "has-error": monthError,
                })}
                aria-required="true"
              />
            </InputLabel>
          </div>

          <div className="col-span-2">
            <InputLabel id={year}>
              {translations.splitDateComponent.jahrInputLabel.de}
              <input
                {...yearField.getInputProps({
                  id: year,
                  inputMode: "numeric",
                })}
                type="number"
                placeholder={
                  translations.splitDateComponent.jahrInputPlaceholder.de
                }
                autoComplete={autocompleteMap[year] ?? "off"}
                name={year}
                className={classNames("ds-input w-full", {
                  "has-error": yearError,
                })}
                aria-required="true"
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
