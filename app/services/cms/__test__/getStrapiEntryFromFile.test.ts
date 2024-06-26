import fs from "node:fs";
import { faker } from "@faker-js/faker";
import { strapiFooterFactory } from "tests/factories/cmsModels/strapiFooter";
import { getStrapiEntryFromFile } from "~/services/cms/getStrapiEntryFromFile";
import { type StrapiFileContent } from "~/services/cms/models/StrapiFileContent";
import { StrapiLocaleSchema } from "~/services/cms/models/StrapiLocale";
import { type StrapiPage } from "~/services/cms/models/StrapiPage";

vi.mock("node:fs");

describe("services/cms", () => {
  describe("getStrapiEntryFromFile", () => {
    const footerData = strapiFooterFactory.build();
    const impressumPath = "/impressum";
    const impressum = {
      slug: impressumPath,
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.past().toISOString(),
      publishedAt: faker.date.past().toISOString(),
      locale: StrapiLocaleSchema.Values.de,
      meta: {
        title: "Impressum",
        description: "description",
        ogTitle: null,
        breadcrumb: "Impressum",
      },
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
      "form-flow-pages": [],
      translations: [],
    } satisfies StrapiFileContent;
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(fileContent));

    test("returns an entry", async () => {
      expect(
        await getStrapiEntryFromFile({
          apiId: "footer",
          locale: "de",
        }),
      ).toEqual(footerData);
    });

    describe("when no entry exists for the given locale", () => {
      it("returns default entry", async () => {
        expect(
          await getStrapiEntryFromFile({
            apiId: "footer",
            locale: "en",
          }),
        ).toEqual(footerData);
      });
    });

    describe("with a slug given", () => {
      it("returns an entry", async () => {
        expect(
          await getStrapiEntryFromFile({
            apiId: "pages",
            filterValue: impressumPath,
            locale: "de",
          }),
        ).toEqual(impressum);
      });

      describe("when no entry exists for the given slug", () => {
        it("returns undefined", async () => {
          expect(
            await getStrapiEntryFromFile({
              apiId: "pages",
              filterValue: "/NOTAVAILABLE",
              locale: "de",
            }),
          ).toBeUndefined();
        });
      });

      describe("with an existing slug in the wrong locale", () => {
        it("returns the default impressum", async () => {
          expect(
            await getStrapiEntryFromFile({
              apiId: "pages",
              filterValue: impressumPath,
              locale: "en",
            }),
          ).toEqual(impressum);
        });
      });
    });
  });
});
