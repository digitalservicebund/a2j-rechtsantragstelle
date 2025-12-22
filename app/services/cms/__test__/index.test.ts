import { getStrapiFooter } from "~/../tests/factories/cmsModels/strapiFooter";
import {
  fetchSingleEntry,
  fetchMultipleTranslations,
} from "~/services/cms/index.server";
import { StrapiFooterSchema } from "~/services/cms/models/StrapiFooter";
import { type StrapiSchemas } from "~/services/cms/schemas";
import { getStrapiEntry } from "../getStrapiEntry";

vi.mock("~/services/cms/getStrapiEntry");

describe("services/cms", () => {
  // eslint-disable-next-line sonarjs/void-use
  beforeEach(() => void vi.clearAllMocks());

  describe("fetchSingleEntry", () => {
    test("returns a footer entry", async () => {
      const footerData = getStrapiFooter();
      vi.mocked(getStrapiEntry).mockReturnValue(Promise.resolve([footerData]));
      expect(await fetchSingleEntry("footer")).toEqual(
        await StrapiFooterSchema.parseAsync(footerData),
      );
    });
  });

  describe("fetchMultipleTranslations", () => {
    test("returns translations for multiple scopes", async () => {
      const mockedTranslations: StrapiSchemas["translations"] = [
        {
          scope: "amtsgericht",
          locale: "de",
          field: [
            { name: "amtsgerichtKey", value: "amtsgerichtValue" },
            { name: "amtsgerichtKey2", value: "amtsgerichtValue2" },
          ],
        },
        {
          scope: "ausgaben",
          locale: "de",
          field: [
            { name: "ausgabenKey", value: "ausgabenValue" },
            { name: "ausgabenKey2", value: "ausgabenValue2" },
          ],
        },
      ];

      vi.mocked(getStrapiEntry).mockResolvedValue(mockedTranslations);

      expect(
        await fetchMultipleTranslations(["amtsgericht", "ausgaben"]),
      ).toEqual({
        amtsgericht: {
          amtsgerichtKey: "amtsgerichtValue",
          amtsgerichtKey2: "amtsgerichtValue2",
        },
        ausgaben: {
          ausgabenKey: "ausgabenValue",
          ausgabenKey2: "ausgabenValue2",
        },
      });
    });
  });
});
