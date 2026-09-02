import { autocompleteMap } from "~/util/autocompleteMap";
import { useField } from "@rvf/react-router";
import classNames from "classnames";
import InputError from "../error/InputError";
import { InputLabel } from "../label/InputLabel";
import { type ErrorMessageProps } from "~/components/common/types";
import { commonTranslations } from "~/services/translations/common";

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

  const dateField = useField(name);
  const dayField = useField(day);
  const monthField = useField(month);
  const yearField = useField(year);

  const dateError = dateField.error();
  const dayError = dayField.error();
  const monthError = monthField.error();
  const yearError = yearField.error();
  const fieldError = dayError ?? monthError ?? yearError ?? dateError;

  const dayHasError = dayError !== null || dateError !== null;
  const monthHasError = monthError !== null;
  const yearHasError = yearError !== null;

  const hasError = Boolean(fieldError);
  const errorId = `${name}-error`;

  return (
    <fieldset
      className={classNames("kern-fieldset", {
        "kern-fieldset--error": hasError,
      })}
    >
      {label && <InputLabel name={name} label={label} suffix={suffix} />}
      <div className="kern-hint">
        {commonTranslations.common.birthdateTextExample.de}
      </div>
      <div className="kern-fieldset__body kern-fieldset__body--horizontal">
        <div className="kern-form-input">
          <label className="kern-label" htmlFor={day}>
            {commonTranslations.common.day.de}
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
            aria-invalid={dayHasError}
            aria-describedby={dayHasError ? errorId : undefined}
          />
        </div>

        <div className="kern-form-input">
          <label className="kern-label" htmlFor={month}>
            {commonTranslations.common.month.de}
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
            aria-invalid={monthHasError}
            aria-describedby={monthHasError ? errorId : undefined}
          />
        </div>

        <div className="kern-form-input">
          <label className="kern-label" htmlFor={year}>
            {commonTranslations.common.year.de}
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
            aria-invalid={yearHasError}
            aria-describedby={yearHasError ? errorId : undefined}
          />
        </div>
      </div>
      {hasError && (
        <InputError id={errorId}>
          {errorMessages?.find((err) => err.code === fieldError)?.text ??
            fieldError}
        </InputError>
      )}
    </fieldset>
  );
};

export default SplitDateInput;
