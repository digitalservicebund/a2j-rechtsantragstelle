import axios from "axios";
import type { GetStrapiEntryOpts } from "~/services/cms/index.server";
import { getStrapiEntryFromApi } from "~/services/cms/getStrapiEntryFromApi";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("services/cms", () => {
  describe("getStrapiEntryFromApi", () => {
    afterEach(() => {
      axiosGetSpy.mockClear();
    });

    const data = "data";
    const defaultOptions: GetStrapiEntryOpts = {
      apiId: "api-id",
      locale: "de",
    };
    const defaultResponseData = { data: { data } };
    const emptyResponseData = { data: [] };
    const expectedRequestUrl = "test://cms/api/api-id?populate=deep&locale=de";
    const expectedStagingRequestUrl =
      "test://cms/api/api-id?populate=deep&locale=sg";
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
      await getStrapiEntryFromApi({ ...defaultOptions, slug: "foobar" });
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
      mockedAxios.get.mockResolvedValue({ data: { data: [data] } });
      expect(await getStrapiEntryFromApi(defaultOptions)).toEqual(data);
    });
  });
});
