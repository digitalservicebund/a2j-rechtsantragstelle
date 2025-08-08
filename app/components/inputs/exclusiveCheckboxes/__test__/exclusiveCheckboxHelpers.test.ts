import { type FieldApi } from "@rvf/react-router";
import { fieldValuesToCheckboxProps } from "~/components/inputs/exclusiveCheckboxes/exclusiveCheckboxHelpers";
import { type StrapiCheckboxComponent } from "~/services/cms/components/StrapiCheckbox";
import { type ExclusiveCheckboxes } from "~/services/validation/checkedCheckbox";

describe("exclusiveCheckboxHelpers", () => {
  describe("fieldValuesToCheckboxProps", () => {
    it("should convert FieldApi values to an array of ControlledCheckboxProps", () => {
      const field = {
        value: () => ({
          one: "on",
          two: "off",
          three: "on",
          none: "off",
        }),
      };
      const cmsCheckboxes = [
        { name: "one", label: "One" },
        { name: "two", label: "Two" },
        { name: "three", label: "Three" },
        { name: "none", label: "None" },
      ];
      const result = fieldValuesToCheckboxProps(
        field as unknown as FieldApi<ExclusiveCheckboxes>,
        cmsCheckboxes as StrapiCheckboxComponent[],
        "off",
      );
      expect(result).toEqual([
        { name: "one", label: "One", value: "on" },
        { name: "two", label: "Two", value: "off" },
        { name: "three", label: "Three", value: "on" },
        { name: "none", label: "None", value: "off" },
      ]);
    });

    it("should use the noneCheckboxValue instead of the field's value if the checkbox is the special 'none' toggle", () => {
      const field = {
        value: () => ({
          none: "off",
        }),
      };
      const cmsCheckboxes = [{ name: "none", label: "None" }];
      const result = fieldValuesToCheckboxProps(
        field as unknown as FieldApi<ExclusiveCheckboxes>,
        cmsCheckboxes as StrapiCheckboxComponent[],
        "on",
      );
      expect(result).toEqual([{ name: "none", label: "None", value: "on" }]);
    });

    it("should replace the name/label values with [not found] if a corresponding checkbox isn't found within CMS data", () => {
      const field = {
        value: () => ({
          doesntExist: "off",
        }),
      };
      const cmsCheckboxes = [{ name: "none", label: "None" }];
      const result = fieldValuesToCheckboxProps(
        field as unknown as FieldApi<ExclusiveCheckboxes>,
        cmsCheckboxes as StrapiCheckboxComponent[],
        "on",
      );
      expect(result).toEqual([
        { name: "[Name not found]", label: "[Label not found]", value: "off" },
      ]);
    });
  });
});
