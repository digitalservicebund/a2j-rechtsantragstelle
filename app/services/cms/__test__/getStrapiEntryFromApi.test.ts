import axios from "axios";
import { getStrapiEntryFromApi } from "~/services/cms/getStrapiEntryFromApi";
import type { GetStrapiEntryOpts } from "~/services/cms/index.server";
import { defaultLocale } from "~/services/cms/models/StrapiLocale";

const API_URL = "test://cms/api/";

describe("services/cms", () => {
  beforeAll(() => {
    vi.stubEnv("STRAPI_API", API_URL);
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  describe("getStrapiEntryFromApi", () => {
    const expectedData = "data";
    const dataResponse = { attributes: expectedData };
    const defaultOptions: GetStrapiEntryOpts = {
      apiId: "pages",
      locale: defaultLocale,
    };
    const defaultResponseData = { data: { data: dataResponse } };
    const emptyResponseData = { data: [] };
    const expectedRequestUrl = `${API_URL}pages?populate=deep&locale=de`;
    const expectedStagingRequestUrl = `${API_URL}pages?populate=deep&locale=sg`;

    const axiosGetSpy = vi.spyOn(axios, "get");

    afterEach(() => {
      axiosGetSpy.mockClear();
    });

    test("request url", async () => {
      axiosGetSpy
        .mockResolvedValue(defaultResponseData)
        .mockResolvedValueOnce(emptyResponseData);
      await getStrapiEntryFromApi(defaultOptions);
      expect(axiosGetSpy).toHaveBeenNthCalledWith(
        1,
        expectedStagingRequestUrl,
        expect.anything(),
      );
      expect(axiosGetSpy).toHaveBeenNthCalledWith(
        2,
        expectedRequestUrl,
        expect.anything(),
      );
    });

    test("request url with optional slug given", async () => {
      axiosGetSpy
        .mockResolvedValue(defaultResponseData)
        .mockResolvedValueOnce(emptyResponseData);
      await getStrapiEntryFromApi({ ...defaultOptions, filterValue: "foobar" });
      expect(axiosGetSpy).toHaveBeenNthCalledWith(
        1,
        `${expectedStagingRequestUrl}&filters[slug][$eq]=foobar`,
        expect.anything(),
      );
      expect(axiosGetSpy).toHaveBeenNthCalledWith(
        2,
        `${expectedRequestUrl}&filters[slug][$eq]=foobar`,
        expect.anything(),
      );
    });

    test("response handling with api returning array", async () => {
      axiosGetSpy.mockResolvedValue({ data: { data: [dataResponse] } });
      expect(await getStrapiEntryFromApi(defaultOptions)).toEqual(expectedData);
    });
  });
});
