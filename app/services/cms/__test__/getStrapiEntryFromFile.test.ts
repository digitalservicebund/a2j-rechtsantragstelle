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
      footer: [{ id: 0, attributes: footerData }],
      pages: [{ id: 0, attributes: impressum }],
      "cookie-banner": [],
      "result-pages": [],
      "vorab-check-pages": [],
      "form-flow-pages": [
        {
          id: 0,
          attributes: {
            createdAt: faker.date.past().toISOString(),
            updatedAt: faker.date.past().toISOString(),
            publishedAt: faker.date.past().toISOString(),
            heading: "",
            locale: StrapiLocaleSchema.Values.de,
            preHeading: null,
            nextButtonLabel: null,
            stepId: "/stepId",
            meta: {
              title: "",
              description: null,
              ogTitle: null,
              breadcrumb: "",
            },
            pre_form: [],
            post_form: [],
            form: [],
            flow_ids: {
              data: [
                { attributes: { flowId: "/geld-einklagen/formular" } },
                { attributes: { flowId: "/fluggastrechte/formular" } },
              ],
            },
          },
        },
      ],
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

    it("can filter by property", async () => {
      expect(
        await getStrapiEntryFromFile({
          apiId: "pages",
          filters: [{ field: "slug", value: impressumPath }],
          locale: "de",
        }),
      ).toEqual(impressum);
    });

    it("can filter by nested property", async () => {
      expect(
        await getStrapiEntryFromFile({
          apiId: "form-flow-pages",
          filters: [
            {
              field: "flow_ids",
              nestedField: "flowId",
              value: "/geld-einklagen/formular",
            },
          ],
        }),
      ).not.toBeUndefined();
    });

    it("can filter by multiple properties", async () => {
      expect(
        await getStrapiEntryFromFile({
          apiId: "form-flow-pages",
          filters: [
            {
              field: "flow_ids",
              nestedField: "flowId",
              value: "/geld-einklagen/formular",
            },
            { field: "stepId", value: "/stepId" },
          ],
        }),
      ).not.toBeUndefined();
    });

    describe("returns undefined when no entry matches", () => {
      it("returns undefined", async () => {
        expect(
          await getStrapiEntryFromFile({
            apiId: "pages",
            filters: [{ field: "slug", value: "/NOTAVAILABLE" }],
            locale: "de",
          }),
        ).toBeUndefined();
      });
    });

    it("falls back to default locale", async () => {
      expect(
        await getStrapiEntryFromFile({
          apiId: "pages",
          filters: [{ field: "slug", value: impressumPath }],
          locale: "en",
        }),
      ).toEqual(impressum);
    });
  });
});
