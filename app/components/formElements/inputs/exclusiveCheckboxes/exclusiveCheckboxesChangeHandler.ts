import { type FieldApi } from "@rvf/react-router";
import { type ExclusiveCheckboxInputProps } from "./ExclusiveCheckboxInput";
import { type ExclusiveCheckboxesType } from "~/services/validation/checkedCheckbox";
import { type CheckboxValue } from "../checkbox/Checkbox";

/**
 * Checkbox change handler, handles both normal checkboxes and the special "none" checkbox
 * Curried for cleaner function call signature in the DOM
 */
export const onCheckboxChange =
  (
    parentField: FieldApi<ExclusiveCheckboxesType | undefined>,
    checkboxes: Array<Omit<ExclusiveCheckboxInputProps, "onChange">>,
    noneCheckboxValue: CheckboxValue,
    setNoneCheckboxValue: React.Dispatch<React.SetStateAction<CheckboxValue>>,
    setCheckboxes: React.Dispatch<
      React.SetStateAction<Array<Omit<ExclusiveCheckboxInputProps, "onChange">>>
    >,
  ) =>
  (checkboxName: string, checked: CheckboxValue) => {
    const existingParentValues =
      parentField.value() ??
      Object.fromEntries(checkboxes.map((c) => [c.name, c.value]));
    if (checkboxName === "none") {
      const newFieldValues =
        checked === "on"
          ? Object.fromEntries(
              Object.entries(existingParentValues).map(([key]) => [key, "off"]),
            )
          : parentField.value();
      parentField.setValue({ ...newFieldValues, none: checked });
      setNoneCheckboxValue(checked);
      if (checked === "on") {
        setCheckboxes((prev) => prev.map((c) => c && { ...c, value: "off" }));
      }
      parentField.validate();
    } else {
      parentField.setValue({
        ...existingParentValues,
        [checkboxName]: checked,
      } as ExclusiveCheckboxesType);
      setCheckboxes((prev) =>
        prev.map((c) =>
          c?.name.split(".").pop() === checkboxName
            ? { ...c, value: checked }
            : c,
        ),
      );
      if (noneCheckboxValue && checked === "on") {
        setNoneCheckboxValue("off");
      }
      parentField.validate();
    }
  };
