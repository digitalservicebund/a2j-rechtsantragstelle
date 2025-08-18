import { StrapiFieldSetComponentSchema } from "../StrapiFieldSet";

describe("StrapiFieldSet", () => {
  it("should parse false in case the formComponents is empty", () => {
    const mockData = {
      heading: "heading",
      __component: "form-elements.fieldset",
      fieldSetGroup: {
        formComponents: [],
      },
      image: null,
      id: 10,
    };

    const actual = StrapiFieldSetComponentSchema.safeParse(mockData);
    expect(actual.success).toBe(false);
  });

  it("should parse true and the conversion data in case the formComponents is not empty", () => {
    const mockData = {
      heading: "heading",
      __component: "form-elements.fieldset",
      fieldSetGroup: {
        formComponents: [
          {
            name: "direktAbflugsDatum",
            label: "Datum geplanter Abflug (z.B. 10.03.2024) ",
            errors: [],
            id: 76,
            placeholder: null,
            __component: "form-elements.date-input",
          },
        ],
      },
      image: null,
      id: 10,
    };

    const actual = StrapiFieldSetComponentSchema.safeParse(mockData);
    expect(actual.success).toBe(true);
    expect(actual.data).toEqual({
      heading: `<p class="ds-subhead">heading</p>`,
      __component: "form-elements.fieldset",
      fieldSetGroup: {
        formComponents: [
          {
            name: "direktAbflugsDatum",
            label: "Datum geplanter Abflug (z.B. 10.03.2024) ",
            errorMessages: [],
            id: 76,
            __component: "form-elements.date-input",
          },
        ],
      },
      id: 10,
    });
  });
});
