import { autocompleteMap } from "~/util/autocompleteMap";
import { useField } from "@rvf/react-router";
import { translations } from "~/services/translations/translations";
import classNames from "classnames";
import InputError from "../kern/formElements/InputError";

type SplitDateInputProps = {
  name: string;
};

const sharedClassnames = "kern-form-input__input bg-white!" as const;
const sharedAttributes = {
  "aria-required": "true",
  type: "text",
  inputMode: "numeric",
  onInput: (e: React.InputEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replaceAll(/\D/g, "");
  },
} as const;

const SplitDateInput = ({ name }: SplitDateInputProps) => {
  const day = name + ".day";
  const month = name + ".month";
  const year = name + ".year";

  const dateField = useField(name);
  const dayField = useField(day);
  const monthField = useField(month);
  const yearField = useField(year);

  const dateError = dateField.error();
  const dayError = dayField.error();
  const monthError = monthField.error();
  const yearError = yearField.error();

  const hasError = Boolean(dayError ?? monthError ?? yearError ?? dateError);
  const errorId = `${name}-error`;

  return (
    <fieldset
      className={classNames("kern-fieldset", {
        "kern-fieldset--error": hasError,
      })}
      {...dateField.getControlProps()}
    >
      <legend className="kern-label">
        {translations.splitDateComponent.legend.de}
      </legend>
      <div className="kern-hint">
        {translations.splitDateComponent.hintText.de}
      </div>
      <div className="kern-fieldset__body kern-fieldset__body--horizontal">
        <div className="kern-form-input">
          <label className="kern-label" htmlFor={day}>
            {translations.splitDateComponent.tagInputLabel.de}
          </label>
          <input
            {...dayField.getInputProps({
              id: day,
              min: 1,
              max: 31,
              maxLength: 2,
              ...sharedAttributes,
            })}
            autoComplete={autocompleteMap[day] ?? "off"}
            className={classNames(
              sharedClassnames,
              "kern-form-input__input--width-2",
              {
                "kern-form-input__input--error": dayError,
              },
            )}
            aria-invalid={dayError !== null}
            aria-describedby={dayError ? errorId : undefined}
          />
        </div>

        <div className="kern-form-input">
          <label className="kern-label" htmlFor={month}>
            {translations.splitDateComponent.monatInputLabel.de}
          </label>
          <input
            {...monthField.getInputProps({
              id: month,
              min: 1,
              max: 12,
              maxLength: 2,
              ...sharedAttributes,
            })}
            autoComplete={autocompleteMap[month] ?? "off"}
            className={classNames(
              sharedClassnames,
              "kern-form-input__input--width-2",
              {
                "kern-form-input__input--error": monthError,
              },
            )}
            aria-invalid={monthError !== null}
            aria-describedby={monthError ? errorId : undefined}
          />
        </div>

        <div className="kern-form-input">
          <label className="kern-label" htmlFor={year}>
            {translations.splitDateComponent.jahrInputLabel.de}
          </label>
          <input
            {...yearField.getInputProps({
              id: year,
              maxLength: 4,
              ...sharedAttributes,
            })}
            autoComplete={autocompleteMap[year] ?? "off"}
            className={classNames(
              sharedClassnames,
              "kern-form-input__input--width-4",
              {
                "kern-form-input__input--error": yearError,
              },
            )}
            aria-invalid={yearError !== null}
            aria-describedby={yearError ? errorId : undefined}
          />
        </div>
      </div>
      {hasError && (
        <InputError id={errorId}>
          {dayError ?? monthError ?? yearError ?? dateError}
        </InputError>
      )}
    </fieldset>
  );
};

export default SplitDateInput;
