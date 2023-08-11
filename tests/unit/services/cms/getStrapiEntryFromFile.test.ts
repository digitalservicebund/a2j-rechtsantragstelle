import { StrapiFileContentSchema } from "~/services/cms/models/StrapiFileContent";
import { getStrapiEntryFromFile } from "~/services/cms/getStrapiEntryFromFile";
import { strapiFooterFactory } from "tests/factories/cmsModels/strapiFooter";
import { StrapiLocaleSchema } from "~/services/cms/models/StrapiLocale";
import { faker } from "@faker-js/faker";

jest.mock("~/services/cms/models/StrapiFileContent", () => {
  return {
    __esModule: true,
    StrapiFileContentSchema: {
      parse: jest.fn(),
    },
  };
});

const mockedStrapiFileContentSchema = StrapiFileContentSchema as jest.Mocked<
  typeof StrapiFileContentSchema
>;

describe("services/cms", () => {
  describe("getStrapiEntryFromFile", () => {
    const footerData = strapiFooterFactory.build();
    const impressum = {
      slug: "/impressum",
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.past().toISOString(),
      publishedAt: faker.date.past().toISOString(),
      locale: StrapiLocaleSchema.Values.de,
      meta: { id: 0, title: "Impressum" },
      content: [],
    };

    mockedStrapiFileContentSchema.parse.mockReturnValue({
      footer: [{ attributes: footerData, id: 0 }],
      pages: [{ id: 0, attributes: impressum }],
      "amtsgericht-common": [],
      "result-pages": [],
      "vorab-check-common": [],
      "vorab-check-pages": [],
    });

    test("returns an entry", async () => {
      expect(
        await getStrapiEntryFromFile({
          apiId: "footer",
          locale: "de",
        }),
      ).toEqual(footerData);
    });

    describe("when no entry exists for the given locale", () => {
      it("returns undefined", async () => {
        expect(
          await getStrapiEntryFromFile({
            apiId: "footer",
            locale: "en",
          }),
        ).toBeUndefined();
      });
    });

    describe("with a slug given", () => {
      it("returns an entry", async () => {
        expect(
          await getStrapiEntryFromFile({
            apiId: "pages",
            slug: "/impressum",
            locale: "de",
          }),
        ).toEqual(impressum);
      });

      describe("when no entry exists for the given slug", () => {
        it("returns undefined", async () => {
          expect(
            await getStrapiEntryFromFile({
              apiId: "pages",
              slug: "/NOTAVAILABLE",
              locale: "de",
            }),
          ).toBeUndefined();
        });
      });

      describe("with an existing slug in the wrong locale", () => {
        it("returns undefined", async () => {
          expect(
            await getStrapiEntryFromFile({
              apiId: "pages",
              slug: "/impressum",
              locale: "en",
            }),
          ).toBeUndefined();
        });
      });
    });
  });
});
