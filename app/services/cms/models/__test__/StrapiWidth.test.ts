import { strapiWidthSchema } from "../strapiWidth";

describe("strapiWidthSchema", () => {
  it("transform the strapi data", () => {
    const parsed = strapiWidthSchema.safeParse("characters3");
    expect(parsed.success).toBe(true);
    expect(parsed.data).toEqual("3");
  });

  it("rejects invalid widths", () => {
    const parsed = strapiWidthSchema.safeParse("characters2");
    expect(parsed.success).toBe(false);
  });

  it("transforms null to undefined", () => {
    const parsed = strapiWidthSchema.safeParse(null);
    expect(parsed.success).toBe(true);
    expect(parsed.data).toBeUndefined();
  });
});
