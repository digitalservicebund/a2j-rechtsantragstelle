import { autocompleteMap } from "~/util/autocompleteMap";
import { useField } from "@rvf/react-router";
import { translations } from "~/services/translations/translations";
import classNames from "classnames";
import { ErrorMessageProps } from "~/components/common/types";
import InputError from "./InputError";

type KernDateInputProps = {
  name: string;
  helperText?: string;
  errorMessages?: ErrorMessageProps[];
};

const KernDateInput = ({
  name,
  helperText,
  errorMessages,
}: KernDateInputProps) => {
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
  const helperId = `${name}-helper`;

  return (
    <fieldset
      className={classNames("kern-fieldset", {
        "kern-fieldset--error": hasError,
      })}
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
      aria-errormessage={hasError ? errorId : undefined}
    >
      <legend className="kern-label">
        {translations.splitDateComponent.legend.de}
      </legend>
      <div className="kern-hint">
        {translations.splitDateComponent.hintText.de}
      </div>
      <div className="kern-fieldset__body kern-fieldset__body--horizontal">
        <div className="kern-form-input">
          <label className="kern-label" id={day}>
            {translations.splitDateComponent.tagInputLabel.de}
          </label>
          <input
            className={classNames(
              "kern-form-input__input kern-form-input__input--width-2 bg-white!",
              {
                "kern-form-input__input--error": dayError,
              },
            )}
            {...dayField.getInputProps({
              inputMode: "numeric",
              id: day,
            })}
            min={1}
            max={31}
            maxLength={2}
            type="text"
            autoComplete={autocompleteMap[day] ?? "off"}
            name={day}
            aria-required={
              !!errorMessages?.find((err) => err.code === "required")
            }
            aria-invalid={dayError !== null}
            aria-describedby={[
              dayError && errorId,
              helperText && helperId,
            ].join(" ")}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replaceAll(
                /\D/g,
                "",
              );
            }}
          />
        </div>
        <div className="kern-form-input">
          <label className="kern-label" id={month}>
            {translations.splitDateComponent.monatInputLabel.de}
          </label>
          <input
            className={classNames(
              "kern-form-input__input kern-form-input__input--width-2 bg-white!",
              {
                "kern-form-input__input--error": monthError,
              },
            )}
            {...monthField.getInputProps({
              inputMode: "numeric",
              id: month,
            })}
            min={1}
            max={12}
            maxLength={2}
            type="text"
            autoComplete={autocompleteMap[month] ?? "off"}
            name={month}
            aria-required={
              !!errorMessages?.find((err) => err.code === "required")
            }
            aria-invalid={monthError !== null}
            aria-describedby={[
              monthError && errorId,
              helperText && helperId,
            ].join(" ")}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replaceAll(
                /\D/g,
                "",
              );
            }}
          />
        </div>
        <div className="kern-form-input">
          <label className="kern-label" id={year}>
            {translations.splitDateComponent.jahrInputLabel.de}
          </label>
          <input
            className={classNames(
              "kern-form-input__input kern-form-input__input--width-4 bg-white!",
              {
                "kern-form-input__input--error": yearError,
              },
            )}
            {...yearField.getInputProps({
              inputMode: "numeric",
              id: year,
            })}
            min={1900}
            max={new Date().getFullYear()}
            maxLength={4}
            type="text"
            autoComplete={autocompleteMap[year] ?? "off"}
            name={year}
            aria-required={
              !!errorMessages?.find((err) => err.code === "required")
            }
            aria-invalid={yearError !== null}
            aria-describedby={[
              yearError && errorId,
              helperText && helperId,
            ].join(" ")}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replaceAll(
                /\D/g,
                "",
              );
            }}
          />
        </div>
      </div>
      {hasError && (
        <InputError id={errorId}>
          {dayError ?? monthError ?? yearError}
        </InputError>
      )}
    </fieldset>
  );
};

export default KernDateInput;
