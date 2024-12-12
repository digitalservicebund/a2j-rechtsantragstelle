import { getImageProps } from "~/services/cms/models/StrapiImage";

describe("getImageProps", () => {
  it("returns props in correct format", () => {
    const result = getImageProps({
      data: {
        attributes: {
          name: "name",
          url: "url",
          previewUrl: "previewUrl",
          width: 1,
          height: 2,
          size: 3,
          alternativeText: "alternativeText",
          ext: ".ext",
          mime: "image/mime",
          caption: "caption",
          formats: { key: "value" },
          hash: "hash",
          provider: "provider",
          provider_metadata: "provider_metadata",
        },
      },
    });

    expect(result).toEqual({
      url: "url",
      width: 1,
      height: 2,
      alternativeText: "alternativeText",
    });
  });

  it("does not return an empty object", () => {
    const result = getImageProps({});
    expect(result).toEqual(undefined);
  });
});
