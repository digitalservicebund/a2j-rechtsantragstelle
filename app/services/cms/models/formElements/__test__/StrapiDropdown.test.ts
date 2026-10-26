import { StrapiDropdownComponentSchema } from "../StrapiDropdown";

describe("StrapiDropdownComponentSchema", () => {
  test("schema conversion", () => {
    const parsed = StrapiDropdownComponentSchema.safeParse({
      __component: "form-elements.dropdown",
      name: "name",
      label: null,
      altLabel: null,
      options: [{ value: "value", text: "text", preSelected: false }],
      placeholder: null,
      errors: null,
      id: 10,
      size: "large",
    });

    expect(parsed.success).toBe(true);
    expect(parsed.data).toEqual({
      __component: "form-elements.dropdown",
      name: "name",
      options: [{ value: "value", text: "text", preSelected: false }],
      errorMessages: undefined,
      size: "large",
      id: 10,
    });
  });
});
