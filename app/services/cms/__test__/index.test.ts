import { strapiFooterFactory } from "~/../tests/factories/cmsModels/strapiFooter";
import { fetchSingleEntry } from "~/services/cms/index.server";
import { getStrapiEntry } from "../getStrapiEntry";

vi.mock("~/services/cms/getStrapiEntry");

describe("services/cms", () => {
  describe("fetchSingleEntry", () => {
    test("returns a footer entry", async () => {
      const footerData = strapiFooterFactory.build();
      vi.mocked(getStrapiEntry).mockReturnValue(
        new Promise((resolve) => {
          resolve([{ attributes: footerData }]);
        }),
      );
      expect(await fetchSingleEntry("footer")).toEqual(footerData);
    });
  });
});
