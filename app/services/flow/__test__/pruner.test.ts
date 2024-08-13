import _ from "lodash";
import { Mocked } from "vitest";
import { strapiFlowPageFactory } from "tests/factories/cmsModels/strapiFlowPage";
import { fetchFlowPage } from "~/services/cms/index.server";
import { getPaths, addFormFields, getPropsToKeep } from "../pruner";

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
          steps: [
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
          steps: [
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
          steps: [
            "start/start",
            "grundvoraussetzungen/start",
            "grundvoraussetzungen/rechtsschutzversicherung",
            "grundvoraussetzungen/rechtsschutzversicherung-hinweis",
          ],
        },
        {
          steps: [
            "finanzielle-angaben/eigentum-zusammenfassung/bankkonten/daten",
          ],
          arrayIndex: 0,
        },
      ]);
    });

    // todo check for arrays in place
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
          steps: [
            "start/start",
            "grundvoraussetzungen/start",
            "grundvoraussetzungen/rechtsschutzversicherung",
            "grundvoraussetzungen/rechtsschutzversicherung-hinweis",
          ],
        },
        {
          steps: [
            "finanzielle-angaben/eigentum-zusammenfassung/bankkonten/daten",
          ],
          arrayIndex: 0,
        },
        {
          steps: [
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
          steps: [
            "start/start",
            "grundvoraussetzungen/start",
            "grundvoraussetzungen/rechtsschutzversicherung",
            "grundvoraussetzungen/rechtsschutzversicherung-hinweis",
          ],
        },
      ]);
    });

    it("excludes path for subflow if no user data", () => {
      expect(
        getPaths(
          {
            hasBankkonto: "yes",
          },
          "/beratungshilfe/antrag",
        ),
      ).toStrictEqual([
        {
          steps: [
            "start/start",
            "grundvoraussetzungen/start",
            "grundvoraussetzungen/rechtsschutzversicherung",
            "grundvoraussetzungen/rechtsschutzversicherung-hinweis",
          ],
        },
      ]);
    });
  });

  describe("addFormFields", () => {
    let fetchFlowPageMock: Mocked<typeof fetchFlowPage>;

    beforeEach(() => {
      vi.resetAllMocks();

      fetchFlowPageMock = vi
        .mocked(fetchFlowPage)
        .mockResolvedValue(strapiFlowPageFactory.build());
    });

    it("calls cms service with correct params", async () => {
      await addFormFields(
        [{ steps: ["step1", "step2"] }],
        "/beratungshilfe/antrag",
      );

      expect(fetchFlowPageMock).toHaveBeenCalledWith(
        "form-flow-pages",
        "/beratungshilfe/antrag",
        "step1",
      );
      expect(fetchFlowPageMock).toHaveBeenCalledWith(
        "form-flow-pages",
        "/beratungshilfe/antrag",
        "step2",
      );
    });

    it("returns FormFieldPaths", async () => {
      const result = await addFormFields(
        [{ steps: ["step1", "step2"] }],
        "/beratungshilfe/antrag",
      );

      expect(result).toStrictEqual([
        {
          formFields: [expect.any(String), expect.any(String)],
        },
      ]);
    });

    it("keeps array index", async () => {
      const result = await addFormFields(
        [
          { steps: ["step1", "step2"], arrayIndex: undefined },
          { steps: ["step1a", "step2a"], arrayIndex: 0 },
          {
            steps: ["step1b", "step2b", "step3b"],
            arrayIndex: 1,
          },
        ],
        "/beratungshilfe/antrag",
      );

      expect(result).toStrictEqual([
        {
          formFields: [expect.any(String), expect.any(String)],
          arrayIndex: undefined,
        },
        {
          formFields: [expect.any(String), expect.any(String)],
          arrayIndex: 0,
        },
        {
          formFields: [
            expect.any(String),
            expect.any(String),
            expect.any(String),
          ],
          arrayIndex: 1,
        },
      ]);
    });
  });

  describe("getPropsToKeep", () => {
    it("extracts props for base paths", () => {
      const props = getPropsToKeep([
        {
          formFields: ["rechtsschutzversicherung", "wurdeVerklagt"],
          arrayIndex: undefined,
        },
      ]);

      expect(props).toStrictEqual([
        "rechtsschutzversicherung",
        "wurdeVerklagt",
      ]);
    });

    it("extracts props for nested data", () => {
      const props = getPropsToKeep([
        {
          formFields: [
            "weitereseinkommen.fooField",
            "weitereseinkommen.barField",
          ],
        },
      ]);

      expect(props).toStrictEqual([
        "weitereseinkommen.fooField",
        "weitereseinkommen.barField",
      ]);
    });

    it("extracts props for sub paths", () => {
      const props = getPropsToKeep([
        {
          formFields: ["geldanlagen#fooField", "geldanlagen#barField"],
          arrayIndex: 0,
        },
      ]);

      expect(props).toStrictEqual([
        "geldanlagen[0].fooField",
        "geldanlagen[0].barField",
      ]);
    });
  });
});
