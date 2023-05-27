import { GetEntryOpts, getFooter } from "~/services/cms";
import { getEntryFromFile } from "~/services/cms/file";
import { getEntryFromStrapi } from "~/services/cms/strapi";

jest.mock("~/services/cms/strapi", () => {
  return {
    __esModule: true,
    getEntryFromStrapi: jest.fn(),
  };
});

const mockedGetEntryFromStrapi = getEntryFromStrapi as jest.Mocked<
  typeof getEntryFromStrapi
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
