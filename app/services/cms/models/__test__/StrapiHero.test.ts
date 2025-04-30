import { StrapiHeroSchema } from "../StrapiHero";

describe("StrapiHero", () => {
  it("should return false given undefined container", () => {
    const undefinedContainer = {
      heading: {
        text: "someText",
      },
      content: null,
      outerBackground: null,
      container: undefined,
    };

    const actual = StrapiHeroSchema.safeParse(undefinedContainer);

    expect(actual.success).toBe(false);
  });

  it("should return false given undefined heading", () => {
    const undefinedHeading = {
      heading: undefined,
      content: null,
      outerBackground: null,
      container: {
        backgroundColor: "blue",
        paddingBottom: "default",
        paddingTop: "default",
      },
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
      container: {
        backgroundColor: "blue",
        paddingBottom: "default",
        paddingTop: "default",
      },
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
      container: {
        backgroundColor: "blue",
        paddingBottom: "default",
        paddingTop: "default",
      },
      __component: "page.hero",
    });
  });
});
