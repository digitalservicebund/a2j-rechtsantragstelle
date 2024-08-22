import _ from "lodash";
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
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("returns form field names", async () => {
      const stepIds = ["step1", "step2"];

      const result = await getFormFields([{ stepIds }], {
        "/step1": ["field1"],
        "/step2": ["field2"],
      });

      expect(result).toEqual([{ name: "field1" }, { name: "field2" }]);
    });

    it("returns form field names for multiple forms within one flowPage", async () => {
      const result = await getFormFields([{ stepIds: ["step1"] }], {
        "/step1": ["field1", "field2", "field3"],
      });

      expect(result).toEqual([
        { name: "field1" },
        { name: "field2" },
        { name: "field3" },
      ]);
    });

    it("keeps array index", async () => {
      const result = await getFormFields(
        [
          { stepIds: ["step1"] },
          { stepIds: ["step1a", "step2a"], arrayIndex: 0 },
          { stepIds: ["step1b"], arrayIndex: 1 },
        ],
        {
          "/step1": ["field1"],
          "/step1a": ["field1a"],
          "/step2a": ["field2a"],
          "/step1b": ["field1b", "field1b_1"],
        },
      );

      expect(result).toEqual([
        { name: "field1" },
        {
          name: "field1a",
          arrayIndex: 0,
        },
        {
          name: "field2a",
          arrayIndex: 0,
        },
        {
          name: "field1b",
          arrayIndex: 1,
        },
        {
          name: "field1b_1",
          arrayIndex: 1,
        },
      ]);
    });
  });
});
