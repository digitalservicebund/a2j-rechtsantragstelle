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

  it("should transform null buttons to undefined", () => {
    const withNullButtons = {
      heading: {
        text: "someText",
        tagName: "h1",
        look: "default",
      },
      content: null,
      outerBackground: null,
      buttons: null,
    };

    const actual = StrapiHeroSchema.safeParse(withNullButtons);

    expect(actual.success).toBe(true);
    expect(actual?.data?.buttons).toBeUndefined();
  });

  it("should handle hero with buttons", () => {
    const withButtons = {
      heading: {
        text: "someText",
        tagName: "h1",
        look: "default",
      },
      content: null,
      outerBackground: null,
      buttons: [
        {
          text: "Button 1",
          href: "/link-1",
          look: "primary",
          size: "medium",
          fullWidth: false,
          __component: "form-elements.button",
        },
      ],
    };

    const actualWithButtons = StrapiHeroSchema.safeParse(withButtons);
    expect(actualWithButtons.success).toBe(true);
    expect(actualWithButtons?.data?.buttons).toEqual([
      {
        text: "Button 1",
        href: "/link-1",
        look: "primary",
        size: "medium",
        fullWidth: false,
        __component: "form-elements.button",
      },
    ]);
  });

  it("should handle hero without buttons", () => {
    const withoutButtons = {
      heading: {
        text: "someText",
        tagName: "h1",
        look: "default",
      },
      content: null,
      outerBackground: null,
    };

    const actualWithoutButtons = StrapiHeroSchema.safeParse(withoutButtons);
    expect(actualWithoutButtons.success).toBe(true);
    expect(actualWithoutButtons?.data?.buttons).toBeUndefined();
  });
});
