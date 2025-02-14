import { getStrapiEntryFromApi } from "~/services/cms/getStrapiEntryFromApi";
import { stagingLocale } from "~/services/cms/models/StrapiLocale";
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
    const dataResponse = [{ testField: "testData" }];
    const defaultOptions: GetStrapiEntryOpts<"pages"> = {
      apiId: "pages",
      locale: stagingLocale,
    };
    const expectedStagingRequestUrl = `${API_URL}pages?populate=*&pLevel=6&locale=sg`;

    const fetchSpy = vi.spyOn(global, "fetch");

    beforeEach(() => {
      fetchSpy.mockResolvedValue({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ data: dataResponse }),
      } as Response);
    });

    afterEach(() => {
      fetchSpy.mockClear();
    });

    test("request url with property filter", async () => {
      await getStrapiEntryFromApi({
        ...defaultOptions,
        filters: [{ value: "foobar", field: "slug" }],
      });
      expect(fetchSpy).toHaveBeenNthCalledWith(
        1,
        `${expectedStagingRequestUrl}&filters[slug][$eq]=foobar`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        }),
      );
    });

    test("request url with nested property filter", async () => {
      await getStrapiEntryFromApi({
        ...defaultOptions,
        filters: [
          { value: "foobar", field: "flow_ids", nestedField: "flowId" },
        ],
      });

      expect(fetchSpy).toHaveBeenNthCalledWith(
        1,
        `${expectedStagingRequestUrl}&filters[flow_ids][flowId][$eq]=foobar`,
        {
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        },
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
      expect(fetchSpy).toHaveBeenNthCalledWith(
        1,
        `${expectedStagingRequestUrl}&filters[flow_ids][flowId][$eq]=foobar&filters[stepId][$eq]=foobar`,
        {
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        },
      );
    });

    test("request url with $in filter", async () => {
      await getStrapiEntryFromApi({
        ...defaultOptions,
        filters: [
          {
            field: "flow_ids",
            operation: "$in",
            value: ["foobar", "foobar2", "foobar3"],
          },
        ],
      });
      expect(fetchSpy).toHaveBeenNthCalledWith(
        1,
        `${expectedStagingRequestUrl}&filters[flow_ids][$in][0]=foobar&filters[flow_ids][$in][1]=foobar2&filters[flow_ids][$in][2]=foobar3`,
        {
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        },
      );
    });

    test("response handling with api returning array", async () => {
      fetchSpy.mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ data: dataResponse }),
      } as Response);

      const result = await getStrapiEntryFromApi(defaultOptions);
      expect(result).toEqual(dataResponse);
    });

    test("do not throw an exception in case the response status code is 404", async () => {
      fetchSpy.mockResolvedValueOnce({
        status: 404,
        ok: false,
        json: () => Promise.resolve({ data: dataResponse }),
      } as Response);

      await expect(
        getStrapiEntryFromApi(defaultOptions),
      ).resolves.not.toThrow();
    });

    test("throws an exception in case the response status code is 503", async () => {
      fetchSpy.mockResolvedValueOnce({
        status: 503,
        ok: false,
        json: () => Promise.resolve({ data: dataResponse }),
      } as Response);

      await expect(getStrapiEntryFromApi(defaultOptions)).rejects.toThrow();
    });
  });
});
