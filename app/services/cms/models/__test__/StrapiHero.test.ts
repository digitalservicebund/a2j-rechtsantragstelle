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
      __component: "page.hero",
    });
  });

  it("should handle hero with button", () => {
    const withButton = {
      heading: {
        text: "someText",
        tagName: "h1",
        look: "default",
      },
      content: null,
      outerBackground: null,
      button: {
        text: "Button",
        href: "/link",
        look: "primary",
        size: "medium",
        fullWidth: false,
        __component: "form-elements.button",
      },
    };

    const actualWithButton = StrapiHeroSchema.safeParse(withButton);
    expect(actualWithButton.success).toBe(true);
    expect(actualWithButton?.data?.button).toEqual({
      text: "Button",
      href: "/link",
      look: "primary",
      size: "medium",
      fullWidth: false,
      __component: "form-elements.button",
    });
  });

  it("should handle hero without button", () => {
    const withoutButton = {
      heading: {
        text: "someText",
        tagName: "h1",
        look: "default",
      },
      content: null,
      outerBackground: null,
    };

    const actualWithoutButton = StrapiHeroSchema.safeParse(withoutButton);
    expect(actualWithoutButton.success).toBe(true);
    expect(actualWithoutButton?.data?.button).toBeUndefined();
  });
});
