import axios from "axios";
import type { GetEntryOpts } from "~/services/cms";
import { getEntryFromStrapi } from "~/services/cms/strapi";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("strapi", () => {
  describe("getEntryFromStrapi", () => {
    const data = "data";
    const defaultOptions: GetEntryOpts = { apiId: "api-id", locale: "de" };
    const defaultResponseData = { data: { data } };
    const expectedRequestUrl =
      "http://localhost/api/api-id?populate=deep&locale=de";

    test("request url", async () => {
      mockedAxios.get.mockResolvedValue(defaultResponseData);
      const axiosGetSpy = jest.spyOn(mockedAxios, "get");
      await getEntryFromStrapi(defaultOptions);
      expect(axiosGetSpy).toHaveBeenCalledWith(
        expectedRequestUrl,
        expect.anything()
      );
    });

    describe("with optional slug given", () => {
      test("request url", async () => {
        mockedAxios.get.mockResolvedValue(defaultResponseData);
        const axiosGetSpy = jest.spyOn(mockedAxios, "get");
        await getEntryFromStrapi({ ...defaultOptions, slug: "foobar" });
        expect(axiosGetSpy).toHaveBeenCalledWith(
          `${expectedRequestUrl}&filters[slug][$eq]=foobar`,
          expect.anything()
        );
      });
    });

    describe("with api returning array", () => {
      test("response handling", async () => {
        mockedAxios.get.mockResolvedValue({ data: { data: [data] } });
        expect(await getEntryFromStrapi(defaultOptions)).toEqual(data);
      });
    });
  });
});
