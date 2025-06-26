import { StrapiWidthSchema } from "../StrapiWidth";

describe("strapiWidthSchema", () => {
  it("transform the strapi data", () => {
    const parsed = StrapiWidthSchema.safeParse("characters3");
    expect(parsed.success).toBe(true);
    expect(parsed.data).toEqual("3");
  });

  it("rejects invalid widths", () => {
    const parsed = StrapiWidthSchema.safeParse("characters2");
    expect(parsed.success).toBe(false);
  });

  it("transforms null to undefined", () => {
    const parsed = StrapiWidthSchema.safeParse(null);
    expect(parsed.success).toBe(true);
    expect(parsed.data).toBeUndefined();
  });
});
