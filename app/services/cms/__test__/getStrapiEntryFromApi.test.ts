import axios from "axios";
import { getStrapiEntryFromApi } from "~/services/cms/getStrapiEntryFromApi";
import type { GetStrapiEntryOpts } from "~/services/cms/index.server";
import { defaultLocale } from "~/services/cms/models/StrapiLocale";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("services/cms", () => {
  describe("getStrapiEntryFromApi", () => {
    afterEach(() => {
      axiosGetSpy.mockClear();
    });

    const expectedData = "data";
    const dataResponse = { attributes: expectedData };
    const defaultOptions: GetStrapiEntryOpts = {
      apiId: "pages",
      locale: defaultLocale,
    };
    const defaultResponseData = { data: { data: dataResponse } };
    const emptyResponseData = { data: [] };
    const expectedRequestUrl = "test://cms/api/pages?populate=deep&locale=de";
    const expectedStagingRequestUrl =
      "test://cms/api/pages?populate=deep&locale=sg";
    const axiosGetSpy = jest.spyOn(mockedAxios, "get");

    test("request url", async () => {
      mockedAxios.get
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
      mockedAxios.get
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
      mockedAxios.get.mockResolvedValue({ data: { data: [dataResponse] } });
      expect(await getStrapiEntryFromApi(defaultOptions)).toEqual(expectedData);
    });
  });
});
