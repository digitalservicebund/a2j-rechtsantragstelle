import _ from "lodash";
import { fetchAllFormFields } from "~/services/cms/index.server";
import { getPaths, getFormFields } from "../pruner";

vi.mock("~/services/cms/index.server");

describe("pruner", () => {
  describe("getPaths", () => {
    it("returns base path with steps", () => {
      expect(
        getPaths(
          { rechtsschutzversicherung: "no", wurdeVerklagt: "no" },
          "/beratungshilfe/antrag",
        ),
      ).toStrictEqual([
        {
          stepIds: [
            "start/start",
            "grundvoraussetzungen/start",
            "grundvoraussetzungen/rechtsschutzversicherung",
            "grundvoraussetzungen/wurde-verklagt",
            "grundvoraussetzungen/klage-eingereicht",
            "grundvoraussetzungen/klage-eingereicht-hinweis",
          ],
        },
      ]);
    });

    it("omits steps the user has not seen in base path", () => {
      expect(
        getPaths(
          {
            rechtsschutzversicherung: "no",
            wurdeVerklagt: "no",
            anwaltskanzlei: "no",
          },
          "/beratungshilfe/antrag",
        ),
      ).toStrictEqual([
        {
          stepIds: [
            "start/start",
            "grundvoraussetzungen/start",
            "grundvoraussetzungen/rechtsschutzversicherung",
            "grundvoraussetzungen/wurde-verklagt",
            "grundvoraussetzungen/klage-eingereicht",
            "grundvoraussetzungen/klage-eingereicht-hinweis",
          ],
        },
      ]);
    });

    it("includes path for subflow", () => {
      expect(
        getPaths(
          {
            hasBankkonto: "yes",
            bankkonten: [
              {
                kontoEigentuemer: "myself",
                bankName: "FooBank",
                kontostand: "199,00",
                iban: "",
                kontoDescription: "private Account",
              },
            ],
          },
          "/beratungshilfe/antrag",
        ),
      ).toStrictEqual([
        {
          stepIds: [
            "start/start",
            "grundvoraussetzungen/start",
            "grundvoraussetzungen/rechtsschutzversicherung",
            "grundvoraussetzungen/rechtsschutzversicherung-hinweis",
          ],
        },
        {
          stepIds: [
            "finanzielle-angaben/eigentum-zusammenfassung/bankkonten/daten",
          ],
          arrayIndex: 0,
        },
      ]);
    });

    it("includes multiple paths for subflows", () => {
      expect(
        getPaths(
          {
            hasBankkonto: "yes",
            bankkonten: [
              {
                kontoEigentuemer: "myself",
                bankName: "FooBank",
                kontostand: "199,00",
                iban: "",
                kontoDescription: "private Account",
              },
              {
                kontoEigentuemer: "myself",
                bankName: "BarBank",
                kontostand: "199,00",
                iban: "",
                kontoDescription: "private Account",
              },
            ],
          },
          "/beratungshilfe/antrag",
        ),
      ).toStrictEqual([
        {
          stepIds: [
            "start/start",
            "grundvoraussetzungen/start",
            "grundvoraussetzungen/rechtsschutzversicherung",
            "grundvoraussetzungen/rechtsschutzversicherung-hinweis",
          ],
        },
        {
          stepIds: [
            "finanzielle-angaben/eigentum-zusammenfassung/bankkonten/daten",
          ],
          arrayIndex: 0,
        },
        {
          stepIds: [
            "finanzielle-angaben/eigentum-zusammenfassung/bankkonten/daten",
          ],
          arrayIndex: 1,
        },
      ]);
    });

    it("excludes path for subflow if statement key not 'yes'", () => {
      expect(
        getPaths(
          {
            hasBankkonto: "no",
            bankkonten: [
              {
                kontoEigentuemer: "myself",
                bankName: "FooBank",
                kontostand: "199,00",
                iban: "",
                kontoDescription: "private Account",
              },
            ],
          },
          "/beratungshilfe/antrag",
        ),
      ).toStrictEqual([
        {
          stepIds: [
            "start/start",
            "grundvoraussetzungen/start",
            "grundvoraussetzungen/rechtsschutzversicherung",
            "grundvoraussetzungen/rechtsschutzversicherung-hinweis",
          ],
        },
      ]);
    });

    it("excludes path for subflow if no user data but statement key 'yes'", () => {
      expect(
        getPaths(
          {
            hasBankkonto: "yes",
          },
          "/beratungshilfe/antrag",
        ),
      ).toStrictEqual([
        {
          stepIds: [
            "start/start",
            "grundvoraussetzungen/start",
            "grundvoraussetzungen/rechtsschutzversicherung",
            "grundvoraussetzungen/rechtsschutzversicherung-hinweis",
          ],
        },
      ]);
    });
  });

  describe("getFormFields", () => {
    const mockFetchAllFormFields = ({
      stepIds = ["step1"],
      formFieldNameGenerator = (stepId: string) => [`formFieldFor-${stepId}`],
    }: {
      stepIds?: string[];
      formFieldNameGenerator?: (stepId: string) => string[];
    } = {}) =>
      vi.mocked(fetchAllFormFields).mockImplementation(
        async (_flowId) =>
          await Promise.resolve(
            stepIds.map((stepId) => ({
              stepId: `/${stepId}`,
              formFields: formFieldNameGenerator(stepId),
            })),
          ),
      );

    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("returns form field names", async () => {
      const stepIds = ["step1", "step2"];

      mockFetchAllFormFields({ stepIds });
      const result = await getFormFields(
        [{ stepIds }],
        "/beratungshilfe/antrag",
      );

      expect(result).toStrictEqual([
        {
          name: "formFieldFor-step1",
          arrayIndex: undefined,
        },
        {
          name: "formFieldFor-step2",
          arrayIndex: undefined,
        },
      ]);
    });

    it("returns form field names for multiple forms within one flowPage", async () => {
      mockFetchAllFormFields({
        stepIds: ["step1"],
        formFieldNameGenerator: (stepId: string) => [
          `formField1For-${stepId}`,
          `formField2For-${stepId}`,
          `formField3For-${stepId}`,
        ],
      });

      const result = await getFormFields(
        [{ stepIds: ["step1"] }],
        "/beratungshilfe/antrag",
      );

      expect(result).toStrictEqual([
        {
          name: "formField1For-step1",
          arrayIndex: undefined,
        },
        {
          name: "formField2For-step1",
          arrayIndex: undefined,
        },
        {
          name: "formField3For-step1",
          arrayIndex: undefined,
        },
      ]);
    });

    it("keeps array index", async () => {
      const path1StepIds = ["step1", "step2"];
      const path2StepIds = ["step1a", "step2a"];
      const path3StepIds = ["step1b", "step2b", "step3b"];

      mockFetchAllFormFields({
        stepIds: [...path1StepIds, ...path2StepIds, ...path3StepIds],
      });
      const result = await getFormFields(
        [
          { stepIds: path1StepIds, arrayIndex: undefined },
          { stepIds: path2StepIds, arrayIndex: 0 },
          {
            stepIds: path3StepIds,
            arrayIndex: 1,
          },
        ],
        "/beratungshilfe/antrag",
      );

      expect(result).toStrictEqual([
        {
          name: "formFieldFor-step1",
          arrayIndex: undefined,
        },
        {
          name: "formFieldFor-step2",
          arrayIndex: undefined,
        },
        {
          name: "formFieldFor-step1a",
          arrayIndex: 0,
        },
        {
          name: "formFieldFor-step2a",
          arrayIndex: 0,
        },
        {
          name: "formFieldFor-step1b",
          arrayIndex: 1,
        },
        {
          name: "formFieldFor-step2b",
          arrayIndex: 1,
        },
        {
          name: "formFieldFor-step3b",
          arrayIndex: 1,
        },
      ]);
    });
  });
});
