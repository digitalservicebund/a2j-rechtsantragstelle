import RichText from "~/components/common/RichText";
import { type CheckboxValue } from "~/components/formElements/Checkbox";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";

export type ControlledCheckboxProps = {
  name: string;
  label: string;
  value: CheckboxValue;
  onChange: (name: string, checked: CheckboxValue) => void;
};

export function ControlledCheckbox({
  name,
  label,
  value,
  onChange,
}: Readonly<ControlledCheckboxProps>) {
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
          data-testid="controlled-checkbox-hidden-input"
          type="hidden"
          name={name}
          value={"off"}
        />
      )}
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={value === "on"}
        value={jsAvailable ? value : "on"}
        className="ds-checkbox forced-colors:outline forced-colors:border-[ButtonText]"
        onChange={(e) =>
          onChange(name.split(".").pop() ?? "", e.target.checked ? "on" : "off")
        }
      />
      {label && (
        <label htmlFor={name}>
          <RichText html={label} />
        </label>
      )}
    </div>
  );
}
