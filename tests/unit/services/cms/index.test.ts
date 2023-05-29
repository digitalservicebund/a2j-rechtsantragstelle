import { GetStrapiEntryOpts, getStrapiFooter } from "~/services/cms";
import { getStrapiEntryFromFile } from "~/services/cms/getStrapiEntryFromFile";
import { getStrapiEntryFromApi } from "~/services/cms/getStrapiEntryFromApi";

jest.mock("~/services/cms/getStrapiEntryFromApi", () => {
  return {
    __esModule: true,
    getStrapiEntryFromApi: jest.fn(),
  };
});

const mockedGetStrapiEntryFromApi = getStrapiEntryFromApi as jest.Mocked<
  typeof getStrapiEntryFromApi
>;

describe("services/cms", () => {
  describe("getFooter", () => {
    test("returns an entry", async () => {
      // TODO: need test factories first to return proper data
      expect(true).toBe(true);
      //const data = FooterFactory;
      ////@ts-ignore
      //mockedGetEntryFromStrapi.mockResolvedValue(data);
      //expect(await getFooter()).toEqual(data);
    });
  });
});
