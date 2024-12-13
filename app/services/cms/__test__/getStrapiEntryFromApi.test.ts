import axios from "axios";
import { getStrapiEntryFromApi } from "~/services/cms/getStrapiEntryFromApi";
import {
  defaultLocale,
  stagingLocale,
} from "~/services/cms/models/StrapiLocale";
import type { GetStrapiEntryOpts } from "../filters";

const API_URL = "test://cms/api/";

describe("services/cms", () => {
  beforeAll(() => {
    vi.stubEnv("STRAPI_API", API_URL);
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  describe("getStrapiEntryFromApi", () => {
    const dataResponse = [{ data: "data" }];
    const defaultOptions: GetStrapiEntryOpts = {
      apiId: "pages",
      locale: stagingLocale,
    };
    const defaultResponseData = { data: { data: dataResponse } };
    const emptyResponseData = { data: [] };
    const expectedRequestUrl = `${API_URL}pages?populate=*&pLevel&locale=de`;
    const expectedStagingRequestUrl = `${API_URL}pages?populate=*&pLevel&locale=sg`;

    const axiosGetSpy = vi.spyOn(axios, "get");

    beforeEach(() => {
      axiosGetSpy
        .mockResolvedValue(defaultResponseData)
        .mockResolvedValueOnce(emptyResponseData);
    });

    afterEach(() => {
      axiosGetSpy.mockClear();
    });

    test("request url with property filter", async () => {
      await getStrapiEntryFromApi({
        ...defaultOptions,
        filters: [{ value: "foobar", field: "slug" }],
      });
      expect(axiosGetSpy).toHaveBeenNthCalledWith(
        1,
        `${expectedStagingRequestUrl}&filters[slug][$eq]=foobar`,
        expect.anything(),
      );
    });

    test("request url with nested property filter", async () => {
      await getStrapiEntryFromApi({
        ...defaultOptions,
        filters: [
          { value: "foobar", field: "flow_ids", nestedField: "flowId" },
        ],
      });
      expect(axiosGetSpy).toHaveBeenNthCalledWith(
        1,
        `${expectedStagingRequestUrl}&filters[flow_ids][flowId][$eq]=foobar`,
        expect.anything(),
      );
    });

    test("request url with multiple property filter", async () => {
      await getStrapiEntryFromApi({
        ...defaultOptions,
        filters: [
          { value: "foobar", field: "flow_ids", nestedField: "flowId" },
          { value: "foobar", field: "stepId" },
        ],
      });
      expect(axiosGetSpy).toHaveBeenNthCalledWith(
        1,
        `${expectedStagingRequestUrl}&filters[flow_ids][flowId][$eq]=foobar&filters[stepId][$eq]=foobar`,
        expect.anything(),
      );
    });

    test("response handling with api returning array", async () => {
      axiosGetSpy.mockResolvedValue({ data: { data: dataResponse } });
      expect(await getStrapiEntryFromApi(defaultOptions)).toEqual(dataResponse);
    });
  });
});
