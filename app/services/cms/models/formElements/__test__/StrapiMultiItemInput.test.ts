import { StrapiMultiItemInputComponentSchema } from "../StrapiMultiItemInput";

describe("StrapiMultiItemInputComponentSchema", () => {
  test("schema conversion", () => {
    const parsed = StrapiMultiItemInputComponentSchema.safeParse({
      __component: "form-elements.multi-item-input",
      name: "kinder",
      countField: "kinderAnzahl",
      itemTitleTemplate: "Kind {{index}}",
      fields: [
        {
          name: "vorname",
          label: "Vorname",
          type: "text",
        },
      ],
      errors: {
        id: 10,
        name: "InputRequired",
        errorCodes: [{ id: 11, code: "required", text: "Pflichtfeld" }],
      },
      count: 2,
    });

    expect(parsed.success).toBe(true);
    expect(parsed.data).toEqual({
      __component: "form-elements.multi-item-input",
      name: "kinder",
      countField: "kinderAnzahl",
      itemTitleTemplate: "Kind {{index}}",
      fields: [
        {
          name: "vorname",
          label: "Vorname",
          type: "text",
        },
      ],
      errorMessages: [{ code: "required", text: "Pflichtfeld" }],
      count: 2,
    });
  });
});
