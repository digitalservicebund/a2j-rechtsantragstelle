import { type StrapiSchemas } from "~/services/cms/schemas";
import { getStrapiEntry } from "../getStrapiEntry";
import { StrapiPageHeaderSchema } from "~/services/cms/models/StrapiPageHeader";
import { getStrapiPageHeader } from "tests/factories/cmsModels/strapiPageHeader";
import {
  fetchMultipleTranslations,
  fetchSingleEntry,
} from "~/services/cms/index.server";

vi.mock("~/services/cms/getStrapiEntry");

describe("services/cms", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("fetchSingleEntry", () => {
    test("returns a page header entry", async () => {
      const pageHeader = getStrapiPageHeader();
      vi.mocked(getStrapiEntry).mockReturnValue(Promise.resolve([pageHeader]));
      expect(await fetchSingleEntry("page-header")).toEqual(
        await StrapiPageHeaderSchema.parseAsync(pageHeader),
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
