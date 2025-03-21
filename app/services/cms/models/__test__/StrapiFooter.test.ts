import { describe, it, expect } from "vitest";
import { getStrapiFooter } from "tests/factories/cmsModels/strapiFooter";
import { StrapiFooterSchema } from "../StrapiFooter";

describe("StrapiFooterSchema", () => {
  it("should validate correct footer data", () => {
    const result = StrapiFooterSchema.parse(getStrapiFooter());
    expect(result).toBeDefined();
    expect(result).not.toHaveProperty("locale");
  });

  it("should allow footer without image", () => {
    const dataWithoutImage = {
      ...getStrapiFooter(),
      image: null,
    };
    const result = StrapiFooterSchema.parse(dataWithoutImage);
    expect(result.image).toBeUndefined(); // Check for undefined instead of null
  });

  it("should require non-empty categorizedLinks array", () => {
    const dataWithEmptyCategories = {
      ...getStrapiFooter(),
      categorizedLinks: [],
    };
    expect(() =>
      StrapiFooterSchema.parse(dataWithEmptyCategories),
    ).toThrowError();
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
    expect(() => StrapiFooterSchema.parse(dataWithEmptyLinks)).toThrowError();
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
    expect(() => StrapiFooterSchema.parse(dataWithEmptyTitle)).toThrowError();
  });
});
