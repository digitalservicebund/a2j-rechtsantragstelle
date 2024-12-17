import {
  getStrapiFlowPage,
  getStrapiFormComponent,
} from "tests/factories/cmsModels/strapiFlowPage";
import { getStrapiFooter } from "~/../tests/factories/cmsModels/strapiFooter";
import { fetchSingleEntry } from "~/services/cms/index.server";
import { fetchAllFormFields } from "../fetchAllFormFields";
import { getStrapiEntry } from "../getStrapiEntry";

vi.mock("~/services/cms/getStrapiEntry");

describe("services/cms", () => {
  // eslint-disable-next-line sonarjs/void-use
  beforeEach(() => void vi.clearAllMocks());

  describe("fetchSingleEntry", () => {
    test("returns a footer entry", async () => {
      const footerData = getStrapiFooter();
      vi.mocked(getStrapiEntry).mockReturnValue(Promise.resolve([footerData]));
      expect(await fetchSingleEntry("footer")).toEqual(footerData);
    });
  });

  describe("fetchAllFormFields", () => {
    test("returns steps with it's form field names", async () => {
      vi.mocked(getStrapiEntry).mockResolvedValue([
        getStrapiFlowPage({
          stepId: "step1",
          form: [getStrapiFormComponent({ name: "formFieldForStep1" })],
        }),

        getStrapiFlowPage({
          stepId: "step2",
          form: [getStrapiFormComponent({ name: "formFieldForStep2" })],
        }),
      ]);

      expect(await fetchAllFormFields("/beratungshilfe/antrag")).toStrictEqual({
        step1: ["formFieldForStep1"],
        step2: ["formFieldForStep2"],
      });
    });

    test("returns steps with multiple form field names", async () => {
      vi.mocked(getStrapiEntry).mockResolvedValue([
        getStrapiFlowPage({
          stepId: "step1",
          form: [
            getStrapiFormComponent({ name: "formField1ForStep1" }),
            getStrapiFormComponent({ name: "formField2ForStep1" }),
            getStrapiFormComponent({ name: "formField3ForStep1" }),
          ],
        }),
      ]);

      expect(await fetchAllFormFields("/beratungshilfe/antrag")).toStrictEqual({
        step1: [
          "formField1ForStep1",
          "formField2ForStep1",
          "formField3ForStep1",
        ],
      });
    });

    test("overwrites formfields from staging", async () => {
      vi.mocked(getStrapiEntry).mockResolvedValue([
        getStrapiFlowPage({
          stepId: "step1",
          form: [
            getStrapiFormComponent({
              name: "formFieldForStepProd",
            }),
          ],
        }),
        getStrapiFlowPage({
          stepId: "step1",
          locale: "sg",
          form: [getStrapiFormComponent({ name: "formFieldForStage" })],
        }),
      ]);

      expect(await fetchAllFormFields("/beratungshilfe/antrag")).toStrictEqual({
        step1: ["formFieldForStage"],
      });
    });

    test("disregards staging formfields in production", async () => {
      vi.mocked(getStrapiEntry)
        .mockResolvedValueOnce([
          getStrapiFlowPage({
            stepId: "step1",
            form: [
              getStrapiFormComponent({
                name: "formFieldForStepProd",
              }),
            ],
          }),
        ])
        .mockResolvedValueOnce([
          getStrapiFlowPage({
            stepId: "step2",
            locale: "sg",
            form: [
              getStrapiFormComponent({
                name: "formFieldForStepStage",
              }),
            ],
          }),
        ]);

      expect(
        await fetchAllFormFields("/beratungshilfe/antrag", "production"),
      ).toStrictEqual({
        step1: ["formFieldForStepProd"],
      });
    });

    test("adds staging steps when not in production", async () => {
      vi.mocked(getStrapiEntry).mockResolvedValue([
        getStrapiFlowPage({
          stepId: "step1",
          locale: "de",
          form: [
            getStrapiFormComponent({
              name: "formFieldForStepProd",
            }),
          ],
        }),

        getStrapiFlowPage({
          stepId: "step2",
          locale: "sg",
          form: [
            getStrapiFormComponent({
              name: "formFieldForStepStage",
            }),
          ],
        }),
      ]);

      expect(await fetchAllFormFields("/beratungshilfe/antrag")).toStrictEqual({
        step1: ["formFieldForStepProd"],
        step2: ["formFieldForStepStage"],
      });
    });

    test("filters out steps without forms", async () => {
      vi.mocked(getStrapiEntry).mockResolvedValue([
        getStrapiFlowPage({
          stepId: "step1",
          form: [],
        }),
      ]);

      expect(await fetchAllFormFields("/beratungshilfe/antrag")).toStrictEqual(
        {},
      );
    });
  });
});
