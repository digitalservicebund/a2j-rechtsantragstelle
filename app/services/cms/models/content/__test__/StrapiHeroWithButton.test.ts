import { StrapiHeroWithButtonSchema } from "../StrapiHeroWithButton";

describe("StrapiHeroWithButton", () => {
  it("should render hero component with button", () => {
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
      __component: "page.hero-with-button",
    };

    const heroWithButton = StrapiHeroWithButtonSchema.safeParse(withButton);
    expect(heroWithButton.success).toBe(true);
    expect(heroWithButton?.data?.button).toEqual({
      text: "Button",
      href: "/link",
      look: "primary",
      size: "medium",
      fullWidth: false,
      __component: "form-elements.button",
    });
  });
});
