import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ErrorMessageProps } from "~/components/common/types";
import { translations } from "~/services/translations/translations";
import { autocompleteMap } from "~/util/autocompleteMap";
import InputError from "../error/InputError";

type SplitDateInputProps = {
  name: string;
  label?: string;
  suffix?: string;
  errorMessages?: ErrorMessageProps[];
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

const SplitDateInput = ({
  name,
  label,
  suffix,
  errorMessages,
}: SplitDateInputProps) => {
  const day = name + ".day";
  const month = name + ".month";
  const year = name + ".year";

  const field = useField(name);
  const dayField = useField(day);
  const monthField = useField(month);
  const yearField = useField(year);

  const groupErrorMessage = field.error();
  /**
   * Should only display errors as soon as all 3 fields have been visited
   */
  const shouldDisplayErrors =
    Boolean(groupErrorMessage) ||
    (dayField.touched() && monthField.touched() && yearField.touched());

  const dayErrorMessage = dayField.error();
  const monthErrorMessage = monthField.error();
  const yearErrorMessage = yearField.error();
  const fieldErrorMessage =
    dayErrorMessage ??
    monthErrorMessage ??
    yearErrorMessage ??
    groupErrorMessage;
  const errorId = `${name}-error`;

  return (
    <fieldset
      className={classNames("kern-fieldset", {
        "kern-fieldset--error":
          Boolean(fieldErrorMessage) && shouldDisplayErrors,
      })}
    >
      {label && (
        <legend className="kern-label">
          {label}
          {suffix && <span className="kern-label__optional">{suffix}</span>}
        </legend>
      )}
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
                "kern-form-input__input--error":
                  dayErrorMessage && shouldDisplayErrors,
              },
            )}
            aria-invalid={Boolean(dayErrorMessage) && shouldDisplayErrors}
            aria-describedby={
              dayErrorMessage && shouldDisplayErrors ? errorId : undefined
            }
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
                "kern-form-input__input--error":
                  monthErrorMessage && shouldDisplayErrors,
              },
            )}
            aria-invalid={Boolean(monthErrorMessage) && shouldDisplayErrors}
            aria-describedby={
              monthErrorMessage && shouldDisplayErrors ? errorId : undefined
            }
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
                "kern-form-input__input--error":
                  yearErrorMessage && shouldDisplayErrors,
              },
            )}
            aria-invalid={Boolean(yearErrorMessage) && shouldDisplayErrors}
            aria-describedby={
              yearErrorMessage && shouldDisplayErrors ? errorId : undefined
            }
          />
        </div>
      </div>
      {Boolean(fieldErrorMessage) && shouldDisplayErrors && (
        <InputError id={errorId}>
          {errorMessages?.find((err) => err.code === fieldErrorMessage)?.text ??
            fieldErrorMessage}
        </InputError>
      )}
    </fieldset>
  );
};

export default SplitDateInput;
