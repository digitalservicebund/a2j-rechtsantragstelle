import { StrapiHeroSchema } from "../StrapiHero";

describe("StrapiHero", () => {
  it("should return false given undefined heading", () => {
    const undefinedHeading = {
      heading: undefined,
      content: null,
      outerBackground: null,
    };

    const actual = StrapiHeroSchema.safeParse(undefinedHeading);

    expect(actual.success).toBe(false);
  });

  it("should return true given all the correct data", () => {
    const withCorrectData = {
      heading: {
        text: "someText",
        tagName: "h1",
        look: "default",
      },
      content: null,
      outerBackground: null,
    };

    const actual = StrapiHeroSchema.safeParse(withCorrectData);

    expect(actual.success).toBe(true);
    expect(actual.data).toEqual({
      heading: {
        text: "someText",
        tagName: "h1",
        look: "default",
        __component: "basic.heading",
      },
      outerBackground: null,
      __component: "page.hero",
    });
  });
});
