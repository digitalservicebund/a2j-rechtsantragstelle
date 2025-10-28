import { StrapiImageSchema } from "~/services/cms/models/StrapiImage";

const mockSvgString = "svgString";
const fetchMock = vi
  .fn()
  .mockResolvedValue({ text: () => Promise.resolve(mockSvgString) });
globalThis.fetch = fetchMock;

describe("StrapiImageSchema", () => {
  it("should return the unmodified object if it's not an SVG", async () => {
    const strapiImage = {
      url: "",
      width: 0,
      height: 0,
      alternativeText: "",
    };
    const result = await StrapiImageSchema.safeParseAsync(strapiImage);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(strapiImage);
  });

  it("should fetch an SVG image and return an empty url", async () => {
    const imageURL = "data:image/svg+xml;base64,.....";
    const strapiImage = {
      url: imageURL,
      width: 0,
      height: 0,
      alternativeText: "",
    };
    const result = await StrapiImageSchema.safeParseAsync(strapiImage);
    expect(fetchMock).toHaveBeenCalledWith(imageURL);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      ...strapiImage,
      svgString: mockSvgString,
      url: "",
    });
  });
});
