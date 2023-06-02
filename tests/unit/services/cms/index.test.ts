import { getStrapiFooter } from "~/services/cms";
import { getStrapiEntryFromApi } from "~/services/cms/getStrapiEntryFromApi";
import { strapiFooterFactory } from "~/../tests/factories/cmsModels/strapiFooter";

jest.mock("~/services/cms/getStrapiEntryFromApi", () => {
  return {
    __esModule: true,
    getStrapiEntryFromApi: jest.fn(),
  };
});

const mockedGetStrapiEntryFromApi = getStrapiEntryFromApi as jest.Mock;

describe("services/cms", () => {
  describe("getStrapiFooter", () => {
    test("returns a footer entry", async () => {
      const footerData = strapiFooterFactory.build();
      mockedGetStrapiEntryFromApi.mockReturnValueOnce({
        attributes: footerData,
      });
      expect(await getStrapiFooter()).toEqual(footerData);
    });
  });
});
