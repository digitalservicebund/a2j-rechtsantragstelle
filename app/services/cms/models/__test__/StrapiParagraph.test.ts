import { StrapiParagraphSchema } from "../StrapiParagraph";

describe("StrapiParagraph", () => {
  it("should validate and transform Strapi paragraph data correctly", () => {
    const cmsData = {
      id: 1,
      text: "This is a test paragraph.",
      __component: "basic.paragraph",
    };

    const result = StrapiParagraphSchema.parse(cmsData);

    expect(result).toEqual({
      __component: "basic.paragraph",
      id: 1,
      html: '<p id="paragraph-1">This is a test paragraph.</p>',
    });
  });

  it("should throw an error for invalid Strapi paragraph data", () => {
    const invalidCmsData = {
      id: 1,
      __component: "basic.paragraph",
    };

    expect(() => StrapiParagraphSchema.parse(invalidCmsData)).toThrow();
  });
});
