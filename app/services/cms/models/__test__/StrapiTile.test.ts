import { StrapiTileSchema } from "../StrapiTile";

describe("StrapiTileSchema", () => {
  it("should fail the parse in case is missing the title", () => {
    const undefinedTitle = {
      title: undefined,
      value: "something",
      description: null,
      image: null,
      tagDescription: null,
    };

    const actual = StrapiTileSchema.safeParse(undefinedTitle);

    expect(actual.success).toBe(false);
  });

  it("should fail the parse in case is missing the value", () => {
    const undefinedValue = {
      title: "something",
      value: null,
      description: null,
      image: null,
      tagDescription: null,
    };

    const actual = StrapiTileSchema.safeParse(undefinedValue);

    expect(actual.success).toBe(false);
  });

  it("should success the parse in case the object is ok", () => {
    const undefinedValue = {
      title: "something",
      value: "something",
      description: null,
      image: null,
      tagDescription: null,
    };

    const actual = StrapiTileSchema.safeParse(undefinedValue);

    expect(actual.success).toBe(true);
    expect(actual.data).toEqual({
      title: "something",
      value: "something",
      tagDescription: undefined,
      description: undefined,
    });
  });

  it("should parse the description with `p` with all the attributes", () => {
    const undefinedValue = {
      title: "something",
      value: "something",
      description: "description",
      image: null,
      tagDescription: null,
    };

    const actual = StrapiTileSchema.safeParse(undefinedValue);

    expect(actual.success).toBe(true);
    expect(actual.data).toEqual({
      title: "something",
      value: "something",
      tagDescription: undefined,
      description: `<p id="something-description" class="ds-subhead">description</p>`,
    });
  });
});
