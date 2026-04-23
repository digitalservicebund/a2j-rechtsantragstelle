import { StrapiPageHeadingSchema } from "../StrapiPageHeading";

const validHeading = {
  text: "someText",
  tagName: "h1",
  size: "xLarge",
  __component: "basic.heading",
  id: 1,
};

describe("StrapiPageHeading", () => {
  it("should parse successfully with all correct data", () => {
    const input = {
      heading: validHeading,
      paddingTop: "auto",
      paddingBottom: "auto",
      identifier: "my-anchor",
      __component: "page.heading",
      id: 10,
    };

    const actual = StrapiPageHeadingSchema.safeParse(input);

    expect(actual.success).toBe(true);
    expect(actual.data).toEqual({
      heading: {
        text: "someText",
        tagName: "h1",
        size: "xLarge",
        __component: "basic.heading",
        id: 1,
      },
      paddingTop: "auto",
      paddingBottom: "auto",
      identifier: "my-anchor",
      __component: "page.heading",
      id: 10,
    });
  });

  it("should parse with non-default padding values", () => {
    const input = {
      heading: validHeading,
      paddingTop: "40",
      paddingBottom: "0",
      __component: "page.heading",
      id: 10,
    };

    const actual = StrapiPageHeadingSchema.safeParse(input);

    expect(actual.success).toBe(true);
    expect(actual.data?.paddingTop).toBe("40");
    expect(actual.data?.paddingBottom).toBe("0");
  });
});
