import zod from "zod";
import { StrapiArraySummaryComponentSchema } from "../StrapiArraySummary";

describe("StrapiArraySummaryComponentSchema", () => {
  it("should fail parse when category is missing", () => {
    const data = {
      categoryUrl: "/some-url",
      title: { text: "Test Title", tagName: "h2", id: 1, look: "default" },
      description: "Test Description",
      buttonLabel: "Add Item",
      itemLabels: [{ item: "name", value: "Name" }],
      __component: "page.array-summary",
      id: 1,
    };

    const actual = StrapiArraySummaryComponentSchema.safeParse(data);

    expect(actual.success).toBe(false);
    expect(zod.treeifyError(actual.error!).properties).toMatchObject({
      category: {
        errors: expect.arrayContaining([
          "Invalid input: expected string, received undefined",
        ]),
      },
    });
  });

  it("should fail parse when itemLabels is empty array", () => {
    const data = {
      category: "Test Category",
      categoryUrl: "/some-url",
      title: { text: "Test Title", tagName: "h2", id: 1, look: "default" },
      description: "Test Description",
      buttonLabel: "Add Item",
      itemLabels: [],
      __component: "page.array-summary",
      id: 1,
    };

    const actual = StrapiArraySummaryComponentSchema.safeParse(data);

    expect(actual.success).toBe(false);
    expect(zod.treeifyError(actual.error!).properties).toMatchObject({
      itemLabels: {
        errors: expect.arrayContaining([
          "Too small: expected array to have >=1 items",
        ]),
      },
    });
  });

  it("should pass parse and transform the itemLabels to an record object", () => {
    const data = {
      category: "Test Category",
      categoryUrl: "/some-url",
      title: { text: "Test Title", tagName: "h2", id: 1, look: "default" },
      description: "Test Description",
      buttonLabel: "Add Item",
      itemLabels: [
        { item: "name", value: "Name" },
        { item: "age", value: "Age" },
      ],
      __component: "page.array-summary",
      id: 1,
    };

    const actual = StrapiArraySummaryComponentSchema.safeParse(data);

    expect(actual.success).toBe(true);
    expect(actual.data?.itemLabels).toEqual({
      name: "Name",
      age: "Age",
    });
  });
});
