import { type FieldApi } from "@rvf/react-router";
import { type ZodObject } from "zod";
import { fieldValuesToCheckboxProps } from "~/components/formElements/exclusiveCheckboxes/exclusiveCheckboxHelpers";
import { type StrapiCheckboxComponent } from "~/services/cms/models/formElements/StrapiCheckbox";
import {
  exclusiveCheckboxesSchema,
  type ExclusiveCheckboxes,
} from "~/services/validation/checkedCheckbox";

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
        field as unknown as FieldApi<ExclusiveCheckboxes | undefined>,
        {} as ZodObject,
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
        field as unknown as FieldApi<ExclusiveCheckboxes | undefined>,
        {} as ZodObject,
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
        field as unknown as FieldApi<ExclusiveCheckboxes | undefined>,
        {} as ZodObject,
        cmsCheckboxes as StrapiCheckboxComponent[],
        "on",
      );
      expect(result).toEqual([
        { name: "[Name not found]", label: "[Label not found]", value: "off" },
      ]);
    });

    it("should fill the default values from the schema if the field value is undefined", () => {
      const field = {
        value: () => undefined,
      };
      const cmsCheckboxes = [
        { name: "one", label: "One" },
        { name: "two", label: "Two" },
        { name: "three", label: "Three" },
        { name: "none", label: "None" },
      ];
      const result = fieldValuesToCheckboxProps(
        field as unknown as FieldApi<ExclusiveCheckboxes | undefined>,
        exclusiveCheckboxesSchema(["one", "two", "three", "none"]),
        cmsCheckboxes as StrapiCheckboxComponent[],
        "off",
      );
      expect(result).toEqual([
        { name: "one", label: "One", value: "off" },
        { name: "two", label: "Two", value: "off" },
        { name: "three", label: "Three", value: "off" },
        { name: "none", label: "None", value: "off" },
      ]);
    });
  });
});
