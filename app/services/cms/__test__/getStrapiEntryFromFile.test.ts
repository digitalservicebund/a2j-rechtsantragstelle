import fs from "node:fs";
import { getStrapiFlowPage } from "tests/factories/cmsModels/strapiFlowPage";
import {
  defaultLocale,
  StrapiLocaleSchema,
} from "~/services/cms/models/StrapiLocale";
import { type StrapiPage } from "~/services/cms/models/StrapiPage";
import type { StrapiSchemas } from "../schemas";
import { getStrapiPageHeader } from "tests/factories/cmsModels/strapiPageHeader";
import { getStrapiEntryFromFile } from "~/services/cms/getStrapiEntryFromFile";

vi.mock("node:fs");

describe("services/cms", () => {
  describe("getStrapiEntryFromFile", () => {
    const pageHeader = getStrapiPageHeader();
    const impressumPath = "/impressum";
    const impressum = {
      slug: impressumPath,
      locale: StrapiLocaleSchema.enum.de,
      pageMeta: {
        title: "Impressum",
        description: "description",
        breadcrumb: "Impressum",
      },
      content: [],
    } satisfies StrapiPage;

    const fileContent = {
      "page-header": [pageHeader],
      pages: [impressum],
      "cookie-banner": [],
      "result-pages": [],
      "vorab-check-pages": [],
      "form-flow-pages": [
        {
          heading: "",
          locale: StrapiLocaleSchema.enum.de,
          preHeading: null,
          nextButtonLabel: null,
          backButtonLabel: null,
          stepId: "/stepId",
          pageTitle: "page title",
          pre_form: [],
          post_form: [],
          form: [],
          flow_ids: [{ flowId: "/fluggastrechte/formular" }],
        },
        getStrapiFlowPage({
          stepId: "/stepId2",
          form: [],
        }),
        getStrapiFlowPage({
          stepId: "/stepId3",
          form: [],
        }),
      ],
      translations: [],
    } satisfies StrapiSchemas;
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(fileContent));

    test("returns an entry", async () => {
      expect(
        await getStrapiEntryFromFile({
          apiId: "page-header",
          locale: "de",
        }),
      ).toEqual([pageHeader]);
    });

    it("can filter by property", async () => {
      expect(
        await getStrapiEntryFromFile({
          apiId: "pages",
          filters: [{ field: "slug", value: impressumPath }],
          locale: "de",
        }),
      ).toEqual([impressum]);
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

    it("can filter on an array of values ($in operator)", async () => {
      const results = await getStrapiEntryFromFile({
        apiId: "form-flow-pages",
        filters: [
          {
            field: "stepId",
            operation: "$in",
            value: ["/stepId", "/stepId2", "/stepId3"],
          },
        ],
        locale: defaultLocale,
      });
      expect(results).toEqual(fileContent["form-flow-pages"]);
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
  });
});
