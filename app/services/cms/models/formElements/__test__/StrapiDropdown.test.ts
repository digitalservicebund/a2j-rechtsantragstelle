import { StrapiDropdownComponentSchema } from "../StrapiDropdown";

describe("StrapiDropdownComponentSchema", () => {
  test("schema conversion", () => {
    const parsed = StrapiDropdownComponentSchema.safeParse({
      __component: "form-elements.dropdown",
      name: "name",
      label: null,
      altLabel: null,
      options: [{ value: "value", text: "text" }],
      placeholder: null,
      errors: null,
      id: 10,
      width: "characters16",
    });
    expect(parsed.success).toBe(true);
    expect(parsed.data).toEqual({
      __component: "form-elements.dropdown",
      name: "name",
      options: [{ value: "value", text: "text" }],
      errorMessages: undefined,
      width: "16",
      id: 10,
    });
  });
});
