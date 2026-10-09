import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ErrorMessageProps } from "~/components/common/types";
import { translations } from "~/services/translations/translations";
import InputError from "../error/InputError";

type Props = {
  name: string;
  label?: string;
  suffix?: string;
  helperText?: string;
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

export const SplitTimeInput = ({
  name,
  label,
  suffix,
  helperText,
  errorMessages,
}: Props) => {
  const hour = name + ".hour";
  const minute = name + ".minute";

  const field = useField(name);
  const hourField = useField(hour);
  const minuteField = useField(minute);

  const groupErrorMessage = field.error();
  /**
   * Should only display errors as soon as all 2 fields have been visited
   */
  const shouldDisplayErrors =
    Boolean(groupErrorMessage) ||
    (hourField.touched() && minuteField.touched());

  const hourErrorMessage = hourField.error();
  const minuteErrorMessage = minuteField.error();
  const fieldErrorMessage =
    hourErrorMessage ?? minuteErrorMessage ?? groupErrorMessage;
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;

  return (
    <fieldset
      className={classNames("kern-fieldset", {
        "kern-fieldset--error":
          Boolean(fieldErrorMessage) && shouldDisplayErrors,
      })}
      aria-describedby={helperText && helperId}
    >
      {label && (
        <legend className="kern-label">
          {label}
          {suffix && <span className="kern-label__optional">{suffix}</span>}
        </legend>
      )}
      {helperText && (
        <div
          className="kern-hint kern-body kern-body--default kern-body--regular"
          id={helperId}
        >
          {helperText}
        </div>
      )}

      <div className="kern-fieldset__body kern-fieldset__body--horizontal">
        <div className="kern-form-input">
          <label className="kern-label" htmlFor={hour}>
            {translations.splitTimeComponent.hourInputLabel.de}
          </label>
          <input
            {...hourField.getInputProps({
              id: hour,
              min: 0,
              max: 24,
              maxLength: 2,
              ...sharedAttributes,
            })}
            className={classNames(
              sharedClassnames,
              "kern-form-input__input--width-2",
              {
                "kern-form-input__input--error":
                  hourErrorMessage && shouldDisplayErrors,
              },
            )}
            aria-invalid={Boolean(hourErrorMessage) && shouldDisplayErrors}
            aria-describedby={
              hourErrorMessage && shouldDisplayErrors ? errorId : undefined
            }
          />
        </div>

        <div className="flex items-center pt-kern-space-3x-large py-kern-space-2x-small justify-center items-stretch">
          :
        </div>

        <div className="kern-form-input">
          <label className="kern-label" htmlFor={minute}>
            {translations.splitTimeComponent.minuteInputLabel.de}
          </label>
          <input
            {...minuteField.getInputProps({
              id: minute,
              min: 1,
              max: 59,
              maxLength: 2,
              ...sharedAttributes,
            })}
            className={classNames(
              sharedClassnames,
              "kern-form-input__input--width-2",
              {
                "kern-form-input__input--error":
                  minuteErrorMessage && shouldDisplayErrors,
              },
            )}
            aria-invalid={Boolean(minuteErrorMessage) && shouldDisplayErrors}
            aria-describedby={
              minuteErrorMessage && shouldDisplayErrors ? errorId : undefined
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
