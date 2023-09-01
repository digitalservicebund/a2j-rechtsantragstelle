import fs from "node:fs";
import { type StrapiPage } from "~/services/cms/models/StrapiPage";
import { type StrapiFileContent } from "~/services/cms/models/StrapiFileContent";
import { getStrapiEntryFromFile } from "~/services/cms/getStrapiEntryFromFile";
import { strapiFooterFactory } from "tests/factories/cmsModels/strapiFooter";
import { StrapiLocaleSchema } from "~/services/cms/models/StrapiLocale";
import { faker } from "@faker-js/faker";

jest.mock("node:fs");

describe("services/cms", () => {
  describe("getStrapiEntryFromFile", () => {
    const footerData = strapiFooterFactory.build();
    const impressum = {
      slug: "/impressum",
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.past().toISOString(),
      publishedAt: faker.date.past().toISOString(),
      locale: StrapiLocaleSchema.Values.de,
      meta: { title: "Impressum", description: "description" },
      content: [],
    } satisfies StrapiPage;

    const fileContent = {
      "page-header": [],
      global: [],
      footer: [{ id: 0, attributes: footerData }],
      pages: [{ id: 0, attributes: impressum }],
      "cookie-banner": [],
      "amtsgericht-common": [],
      "result-pages": [],
      "vorab-check-common": [],
      "vorab-check-pages": [],
    } satisfies StrapiFileContent;

    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(fileContent));

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
