import classNames from "classnames";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { type CheckboxValue } from "../checkbox/Checkbox";
import { InputLabel } from "../label/InputLabel";

export type ExclusiveCheckboxInputProps = {
  name: string;
  label: string;
  suffix?: string;
  hasError?: boolean;
  value: CheckboxValue;
  onChange: (name: string, checked: CheckboxValue) => void;
};

export const ExclusiveCheckboxInput = ({
  name,
  label,
  value,
  hasError,
  suffix,
  onChange,
}: Readonly<ExclusiveCheckboxInputProps>) => {
  const jsAvailable = useJsAvailable();
  /**
   * HTML Forms do not send unchecked checkboxes.
   * For server-side validation we need a same-named hidden field
   * For front-end validation, we need to hide that field if checkbox is checked
   */
  const showHiddenInput = !jsAvailable || value !== "on";

  return (
    <div className="flex items-center">
      {showHiddenInput && (
        <input
          data-testid="exclusive-checkbox-hidden-input"
          type="hidden"
          name={name}
          value={"off"}
        />
      )}
      <div className="kern-form-check">
        <input
          className={classNames("kern-form-check__checkbox", {
            "kern-form-check__checkbox--error": hasError,
          })}
          type="checkbox"
          id={name}
          name={name}
          checked={value === "on"}
          value={jsAvailable ? value : "on"}
          onChange={(e) =>
            onChange(
              name.split(".").pop() ?? "",
              e.target.checked ? "on" : "off",
            )
          }
        />
        {label && (
          <InputLabel
            name={name}
            label={label}
            suffix={suffix}
            className="hyphens-auto!"
          />
        )}
      </div>
    </div>
  );
};
