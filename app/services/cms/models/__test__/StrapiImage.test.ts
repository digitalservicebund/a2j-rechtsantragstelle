import { StrapiImageSchema } from "~/services/cms/models/StrapiImage";

const mockSvgString = "svgString";
const fetchMock = vi
  .fn()
  .mockResolvedValue({ text: () => Promise.resolve(mockSvgString) });
globalThis.fetch = fetchMock;

const strapiImage = {
  url: "",
  width: 0,
  height: 0,
  alternativeText: "",
  mime: "image/png",
};

describe("StrapiImageSchema", () => {
  it("should return the unmodified object if it's not an SVG", async () => {
    const result = await StrapiImageSchema.safeParseAsync(strapiImage);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(strapiImage);
  });

  describe("inline SVG", () => {
    const mime = "image/svg+xml";
    it("should fetch an SVG image and return an empty url", async () => {
      const imageURL = "https://example.com/image.svg";
      const input = { ...strapiImage, url: imageURL, mime };
      const result = await StrapiImageSchema.safeParseAsync(input);
      const expected = { ...strapiImage, svgString: mockSvgString, mime };
      expect(fetchMock).toHaveBeenCalledWith(imageURL);
      expect(result.data).toEqual(expected);
    });

    it("should decode a base64 SVG image", async () => {
      const url =
        "data:image/svg+xml;base64," +
        Buffer.from(mockSvgString).toString("base64");
      const input = { ...strapiImage, url, mime };
      const result = await StrapiImageSchema.safeParseAsync(input);
      const expected = { ...strapiImage, svgString: mockSvgString, mime };
      expect(result.data).toEqual(expected);
    });
  });
});
