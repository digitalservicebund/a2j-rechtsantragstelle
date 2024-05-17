import { fetchSingleEntry } from "~/services/cms/index.server";
import { getStrapiEntryFromFile } from "~/services/cms/getStrapiEntryFromFile";
import { strapiFooterFactory } from "~/../tests/factories/cmsModels/strapiFooter";

jest.mock("~/services/cms/getStrapiEntryFromFile", () => {
  return {
    __esModule: true,
    getStrapiEntryFromFile: jest.fn(),
  };
});

const mockedgetStrapiEntryFromFile = getStrapiEntryFromFile as jest.Mock;

describe("services/cms", () => {
  describe("fetchSingleEntry", () => {
    test("returns a footer entry", async () => {
      const footerData = strapiFooterFactory.build();
      mockedgetStrapiEntryFromFile.mockReturnValueOnce(footerData);
      expect(await fetchSingleEntry("footer")).toEqual(footerData);
    });
  });
});
