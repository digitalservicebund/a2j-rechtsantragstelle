import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ErrorMessageProps } from "~/components/common/types";
import InputError from "../error/InputError";
import { InputLabel } from "../label/InputLabel";
import { translations } from "~/services/translations/translations";
import { type DropdownOption } from "~/services/cms/models/formElements/StrapiDropdown";
import { widthClassname, type Size } from "../inputWidth";

type SelectProps = {
  name: string;
  label?: string;
  options: DropdownOption[];
  suffix?: string;
  errorMessages?: ErrorMessageProps[];
  size?: Size;
};

const Select = ({
  name,
  label,
  options,
  suffix,
  errorMessages,
  size = "large",
}: SelectProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;

  return (
    <div
      className={classNames("kern-form-input", {
        "kern-form-input--error": field.error(),
      })}
    >
      {label && <InputLabel name={name} label={label} suffix={suffix} />}
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
          className="kern-form-input__select bg-white!"
          {...field.getInputProps({ id: name })}
          aria-invalid={field.error() !== null}
          defaultValue={options.find((option) => option.preSelected)?.value}
          aria-describedby={field.error() ? errorId : undefined}
          aria-errormessage={field.error() ? errorId : undefined}
          aria-required={
            !!errorMessages?.find((err) => err.code === "required")
          }
          data-testid="select"
        >
          <option value="">{translations.select.placeholder.de}</option>
          {options.map((option) => {
            return (
              <option value={option.value} key={option.value}>
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
