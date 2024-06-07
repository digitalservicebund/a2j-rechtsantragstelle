import { strapiFooterFactory } from "~/../tests/factories/cmsModels/strapiFooter";
import { getStrapiEntryFromFile } from "~/services/cms/getStrapiEntryFromFile";
import { fetchSingleEntry } from "~/services/cms/index.server";

vi.mock("~/services/cms/getStrapiEntryFromFile");

describe("services/cms", () => {
  describe("fetchSingleEntry", () => {
    test("returns a footer entry", async () => {
      const footerData = strapiFooterFactory.build();
      vi.mocked(getStrapiEntryFromFile).mockReturnValue(
        new Promise((resolve) => {
          resolve(footerData);
        }),
      );
      expect(await fetchSingleEntry("footer")).toEqual(footerData);
    });
  });
});
