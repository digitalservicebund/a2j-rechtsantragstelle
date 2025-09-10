import { describe, it, expect } from "vitest";
import { getStrapiFooter } from "tests/factories/cmsModels/strapiFooter";
import { StrapiFooterSchema } from "../StrapiFooter";

describe("StrapiFooterSchema", () => {
  it("should validate correct footer data", async () => {
    const result = await StrapiFooterSchema.safeParseAsync(getStrapiFooter());
    expect(result.success).toBe(true);
    expect(result.success && result.data).not.toHaveProperty("locale");
  });

  it("should allow footer without image", async () => {
    const dataWithoutImage = {
      ...getStrapiFooter(),
      image: null,
    };
    const result = await StrapiFooterSchema.safeParseAsync(dataWithoutImage);
    expect(result.success).toBe(true);
    expect(result.success && result.data.image).toBeUndefined();
  });

  it("should require non-empty categorizedLinks array", async () => {
    const dataWithEmptyCategories = {
      ...getStrapiFooter(),
      categorizedLinks: [],
    };
    const result = await StrapiFooterSchema.safeParseAsync(
      dataWithEmptyCategories,
    );
    expect(result.success).toBe(false);
  });

  it("should require non-empty links array in categories", async () => {
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
    const result = await StrapiFooterSchema.safeParseAsync(dataWithEmptyLinks);
    expect(result.success).toBe(false);
  });

  it("should require non-empty category title", async () => {
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
    const result = await StrapiFooterSchema.safeParseAsync(dataWithEmptyTitle);
    expect(result.success).toBe(false);
  });
});
