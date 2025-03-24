import { describe, it, expect } from "vitest";
import { getStrapiFooter } from "tests/factories/cmsModels/strapiFooter";
import { StrapiFooterSchema } from "../StrapiFooter";

describe("StrapiFooterSchema", () => {
  it("should validate correct footer data", () => {
    const result = StrapiFooterSchema.safeParse(getStrapiFooter());
    expect(result.success).toBe(true);
    expect(result.success && result.data).not.toHaveProperty("locale");
  });

  it("should allow footer without image", () => {
    const dataWithoutImage = {
      ...getStrapiFooter(),
      image: null,
    };
    const result = StrapiFooterSchema.safeParse(dataWithoutImage);
    expect(result.success).toBe(true);
    expect(result.success && result.data.image).toBeUndefined();
  });

  it("should require non-empty categorizedLinks array", () => {
    const dataWithEmptyCategories = {
      ...getStrapiFooter(),
      categorizedLinks: [],
    };
    const result = StrapiFooterSchema.safeParse(dataWithEmptyCategories);
    expect(result.success).toBe(false);
  });

  it("should require non-empty links array in categories", () => {
    const dataWithEmptyLinks = {
      ...getStrapiFooter(),
      categorizedLinks: [
        {
          id: 1,
          linkIdentifier: "test-category",
          title: "Category 1",
          links: [],
        },
      ],
    };
    const result = StrapiFooterSchema.safeParse(dataWithEmptyLinks);
    expect(result.success).toBe(false);
  });

  it("should require non-empty category title", () => {
    const dataWithEmptyTitle = {
      ...getStrapiFooter(),
      categorizedLinks: [
        {
          id: 1,
          linkIdentifier: "test-category",
          title: "",
          links: [
            {
              id: 1,
              linkIdentifier: "test-link",
              text: "Link 1",
              url: "https://example.com",
            },
          ],
        },
      ],
    };
    const result = StrapiFooterSchema.safeParse(dataWithEmptyTitle);
    expect(result.success).toBe(false);
  });
});
