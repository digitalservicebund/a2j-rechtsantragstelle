import { type CheckboxValue } from "~/components/formElements/Checkbox";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";

export type KernExclusiveCheckboxInputProps = {
  name: string;
  label: string;
  value: CheckboxValue;
  onChange: (name: string, checked: CheckboxValue) => void;
};

export const KernExclusiveCheckboxInput = ({
  name,
  label,
  value,
  onChange,
}: Readonly<KernExclusiveCheckboxInputProps>) => {
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
          className="kern-form-check__checkbox"
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
          <label className="kern-label" htmlFor={name}>
            {label}
          </label>
        )}
      </div>
    </div>
  );
};
