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
        __component: "basic.heading",
        id: 10,
      },
      identifier: null,
      content: null,
      outerBackground: null,
      button: null,
      __component: "page.hero",
      id: 10,
    };

    const actual = StrapiHeroSchema.safeParse(withCorrectData);

    expect(actual.success).toBe(true);
    expect(actual.data).toEqual({
      heading: {
        text: "someText",
        tagName: "h1",
        look: "default",
        __component: "basic.heading",
        id: 10,
      },
      __component: "page.hero",
      id: 10,
    });
  });

  it("should handle hero with button", () => {
    const withButton = {
      heading: {
        text: "someText",
        tagName: "h1",
        look: "default",
        __component: "basic.heading",
        id: 10,
      },
      content: null,
      identifier: null,
      outerBackground: null,
      button: {
        text: "Button",
        href: "/link",
        look: "primary",
        size: "medium",
        fullWidth: false,
        __component: "form-elements.button",
      },
      id: 10,
      __component: "page.hero",
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
});
