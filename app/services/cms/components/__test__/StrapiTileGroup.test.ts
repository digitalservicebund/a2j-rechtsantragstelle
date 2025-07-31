import { StrapiTileGroupComponentSchema } from "../StrapiTileGroup";

describe("StrapiTileGroupComponentSchema", () => {
  test("schema conversion", () => {
    const parsed = StrapiTileGroupComponentSchema.safeParse({
      __component: "form-elements.tile-group",
      name: "name",
      label: null,
      altLabel: null,
      options: [
        {
          title: "title",
          value: "value",
          description: null,
          image: null,
          tagDescription: null,
        },
      ],
      errors: [],
      id: 10,
      useTwoColumns: true,
    });
    expect(parsed.success).toBe(true);
    expect(parsed.data).toEqual({
      __component: "form-elements.tile-group",
      name: "name",
      id: 10,
      options: [{ value: "value", title: "title" }],
      errorMessages: [],
      useTwoColumns: true,
    });
  });
});
