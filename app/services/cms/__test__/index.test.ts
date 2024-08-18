import {
  strapiFlowPageFactory,
  strapiFormComponentFactory,
} from "tests/factories/cmsModels/strapiFlowPage";
import { strapiFooterFactory } from "~/../tests/factories/cmsModels/strapiFooter";
import { getStrapiEntry } from "~/services/cms/getStrapiEntry";
import {
  fetchAllFormFields,
  fetchSingleEntry,
} from "~/services/cms/index.server";

vi.mock("~/services/cms/getStrapiEntry");

describe("services/cms", () => {
  beforeEach(() => void vi.clearAllMocks());

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

  describe("fetchAllFormFields", () => {
    test("returns steps with it's form field names", async () => {
      vi.mocked(getStrapiEntry).mockResolvedValue([
        {
          attributes: strapiFlowPageFactory.build({
            stepId: "step1",
            form: [
              strapiFormComponentFactory.build({ name: "formFieldForStep1" }),
            ],
          }),
        },
        {
          attributes: strapiFlowPageFactory.build({
            stepId: "step2",
            form: [
              strapiFormComponentFactory.build({ name: "formFieldForStep2" }),
            ],
          }),
        },
      ]);

      expect(await fetchAllFormFields("/beratungshilfe/antrag")).toStrictEqual([
        { stepId: "step1", formFields: ["formFieldForStep1"] },
        { stepId: "step2", formFields: ["formFieldForStep2"] },
      ]);
    });

    test("returns steps with multiple form field names", async () => {
      vi.mocked(getStrapiEntry).mockResolvedValue([
        {
          attributes: strapiFlowPageFactory.build({
            stepId: "step1",
            form: [
              strapiFormComponentFactory.build({ name: "formField1ForStep1" }),
              strapiFormComponentFactory.build({ name: "formField2ForStep1" }),
              strapiFormComponentFactory.build({ name: "formField3ForStep1" }),
            ],
          }),
        },
      ]);

      expect(await fetchAllFormFields("/beratungshilfe/antrag")).toStrictEqual([
        {
          stepId: "step1",
          formFields: [
            "formField1ForStep1",
            "formField2ForStep1",
            "formField3ForStep1",
          ],
        },
      ]);
    });

    test("filters out steps without forms", async () => {
      vi.mocked(getStrapiEntry).mockResolvedValue([
        {
          attributes: strapiFlowPageFactory.build({
            stepId: "step1",
            form: [],
          }),
        },
      ]);

      expect(await fetchAllFormFields("/beratungshilfe/antrag")).toStrictEqual(
        [],
      );
    });
  });
});
