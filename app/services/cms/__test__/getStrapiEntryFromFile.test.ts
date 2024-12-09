import fs from "node:fs";
import { getStrapiFooter } from "tests/factories/cmsModels/strapiFooter";
import { getStrapiEntryFromFile } from "~/services/cms/getStrapiEntryFromFile";
import { StrapiLocaleSchema } from "~/services/cms/models/StrapiLocale";
import { type StrapiPage } from "~/services/cms/models/StrapiPage";
import type { StrapiSchemas } from "../schemas";

vi.mock("node:fs");

describe("services/cms", () => {
  describe("getStrapiEntryFromFile", () => {
    const footerData = getStrapiFooter();
    const impressumPath = "/impressum";
    const impressum = {
      slug: impressumPath,
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
      footer: [{ attributes: footerData }],
      pages: [{ attributes: impressum }],
      "cookie-banner": [],
      "result-pages": [],
      "vorab-check-pages": [],
      "form-flow-pages": [
        {
          attributes: {
            heading: "",
            locale: StrapiLocaleSchema.Values.de,
            preHeading: null,
            nextButtonLabel: null,
            backButtonLabel: null,
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
    } satisfies StrapiSchemas;
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(fileContent));

    test("returns an entry", async () => {
      expect(
        await getStrapiEntryFromFile({
          apiId: "footer",
          locale: "de",
        }),
      ).toEqual([{ attributes: footerData }]);
    });

    describe("when no entry exists for the given locale", () => {
      it("returns default entry", async () => {
        expect(
          await getStrapiEntryFromFile({
            apiId: "footer",
            locale: "en",
          }),
        ).toEqual([{ attributes: footerData }]);
      });
    });

    it("can filter by property", async () => {
      expect(
        await getStrapiEntryFromFile({
          apiId: "pages",
          filters: [{ field: "slug", value: impressumPath }],
          locale: "de",
        }),
      ).toEqual([{ attributes: impressum }]);
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

    it("returns empty array without matches", async () => {
      expect(
        await getStrapiEntryFromFile({
          apiId: "pages",
          filters: [{ field: "slug", value: "/NOTAVAILABLE" }],
          locale: "de",
        }),
      ).toStrictEqual([]);
    });

    it("falls back to default locale", async () => {
      expect(
        await getStrapiEntryFromFile({
          apiId: "pages",
          filters: [{ field: "slug", value: impressumPath }],
          locale: "en",
        }),
      ).toEqual([{ attributes: impressum }]);
    });
  });
});
