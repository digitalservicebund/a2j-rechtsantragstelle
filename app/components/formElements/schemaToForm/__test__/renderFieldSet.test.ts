import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { getFieldSetByFieldName } from "../renderFieldSet";

const mockFormsElements = [
  {
    heading: "heading",
    __component: "form-elements.fieldset",
    fieldSetGroup: {
      formComponents: [
        {
          name: "field1",
          label: "Datum geplanter Abflug (z.B. 10.03.2024) ",
          errorMessages: [],
          id: 76,
          __component: "form-elements.date-input",
        },
        {
          name: "field2",
          label: "Zeit geplanter Abflug (z.B. 09:08)",
          placeholder: undefined,
          errorMessages: [],
          id: 40,
          __component: "form-elements.time-input",
        },
      ],
    },
    id: 1,
  },
] as StrapiFormComponent[];

describe("renderFieldSet", () => {
  describe("getFieldSetByFieldName", () => {
    it("should return the correct FieldSet when fieldName exists", () => {
      const result = getFieldSetByFieldName("field1", mockFormsElements);

      expect(result).toEqual(mockFormsElements[0]);
    });

    it("should return undefined when fieldName does not exist", () => {
      const result = getFieldSetByFieldName(
        "nonExistentField",
        mockFormsElements,
      );

      expect(result).toBeUndefined();
    });
  });
});
