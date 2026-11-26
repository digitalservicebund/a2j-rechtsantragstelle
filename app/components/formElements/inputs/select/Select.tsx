import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ErrorMessageProps } from "~/components/common/types";
import InputError from "../error/InputError";
import { InputLabel } from "../label/InputLabel";
import { translations } from "~/services/translations/translations";
import { type DropdownOption } from "~/services/cms/models/formElements/StrapiDropdown";
import { widthClassname, type Size } from "../inputWidth";
import { InputHelperText } from "~/components/formElements/inputs/helperText/InputHelperText";

type SelectProps = {
  name: string;
  label?: string;
  options: Array<DropdownOption & { disabled?: boolean }>;
  suffix?: string;
  helperText?: string;
  errorMessages?: ErrorMessageProps[];
  size?: Size;
  placeholder?: string;
};

const Select = ({
  name,
  label,
  options,
  suffix,
  helperText,
  errorMessages,
  size = "large",
  placeholder,
}: SelectProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;

  return (
    <div
      className={classNames("kern-form-input", {
        "kern-form-input--error": field.error(),
      })}
    >
      {label && (
        <InputLabel
          name={name}
          label={label}
          suffix={suffix}
          className="mb-0!"
        />
      )}
      {helperText && (
        <InputHelperText helperText={helperText} helperId={helperId} />
      )}
      <div
        data-testid="select-wrapper"
        className={classNames(
          "kern-form-input__select-wrapper",
          {
            "kern-form-input__select-wrapper--error": field.error(),
          },
          widthClassname(size),
        )}
      >
        <select
          className="kern-form-input__select bg-kern-white!"
          {...field.getInputProps({ id: name })}
          aria-invalid={field.error() !== null}
          defaultValue={options.find((option) => option.preSelected)?.value}
          aria-describedby={[
            field.error() && errorId,
            helperText && helperId,
          ].join(" ")}
          aria-errormessage={field.error() ? errorId : undefined}
          aria-required={
            !!errorMessages?.find((err) => err.code === "required")
          }
          data-testid="select"
        >
          <option value="">
            {placeholder ?? translations.select.placeholder.de}
          </option>
          {options.map((option) => {
            return (
              <option
                value={option.value}
                key={option.value}
                disabled={option.disabled}
                aria-disabled={option.disabled}
              >
                {option.text}
              </option>
            );
          })}
        </select>
      </div>
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default Select;
