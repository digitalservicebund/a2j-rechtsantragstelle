import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { flows } from "~/domains/flows.server";
import { buildFlowController } from "../../server/buildFlowController";
import type { Config } from "../../server/types";
import { validFormPaths } from "../validFormPaths";

describe("validFormPaths", () => {
  const { config } = flows["/beratungshilfe/antrag"];

  it("returns base path with reachable steps", () => {
    const data: BeratungshilfeFormularUserData = {
      rechtsschutzversicherung: "no",
    };
    expect(validFormPaths(buildFlowController({ config, data }))).toStrictEqual(
      [
        {
          stepIds: [
            "/start/start",
            "/grundvoraussetzungen/rechtsschutzversicherung",
            "/grundvoraussetzungen/wurde-verklagt",
            "/grundvoraussetzungen/wurde-verklagt-hinweis",
          ],
        },
      ],
    );
  });

  describe("works for arrays", () => {
    const baseData: BeratungshilfeFormularUserData = {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "no",
      klageEingereicht: "no",
      beratungshilfeBeantragt: "no",
      eigeninitiativeGrundvorraussetzung: "no",
      staatlicheLeistungen: "buergergeld",
    };

    it("includes paths for multiple array entries", () => {
      const data: BeratungshilfeFormularUserData = {
        ...baseData,
        hasBankkonto: "yes",
        hasKraftfahrzeug: "no",
        hasGeldanlage: "no",
        hasGrundeigentum: "no",
        hasWertsache: "no",
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
      };
      const validPaths = validFormPaths(buildFlowController({ config, data }));
      expect(validPaths.length).toEqual(3);

      expect(validPaths[1]).toStrictEqual({
        stepIds: ["/finanzielle-angaben/eigentum/bankkonten/bankkonto/daten"],
        arrayIndex: 0,
      });
      expect(validPaths[2]).toStrictEqual({
        stepIds: ["/finanzielle-angaben/eigentum/bankkonten/bankkonto/daten"],
        arrayIndex: 1,
      });
    });

    it("excludes arrays if statement key not 'yes'", () => {
      const data: BeratungshilfeFormularUserData = {
        ...baseData,
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
      };
      const validPaths = validFormPaths(buildFlowController({ config, data }));
      expect(validPaths).toHaveLength(1);
    });

    it("excludes array with empty array but statement key 'yes'", () => {
      const data = { ...baseData, hasBankkonto: "yes", bankkonten: [] };
      const validPaths = validFormPaths(buildFlowController({ config, data }));
      expect(validPaths).toHaveLength(1);
    });
    it("excludes array with undefined array but statement key 'yes'", () => {
      const data = { ...baseData, hasBankkonto: "yes", bankkonten: undefined };
      const validPaths = validFormPaths(buildFlowController({ config, data }));
      expect(validPaths).toHaveLength(1);
    });

    it("excludes array if it can't be reached", () => {
      const data: BeratungshilfeFormularUserData = {
        rechtsschutzversicherung: "yes",
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
      };
      const validPaths = validFormPaths(buildFlowController({ config, data }));
      expect(validPaths).toHaveLength(1);
    });

    it("includes arrays when isArrayRelevant returns true even if statement key is not 'yes'", () => {
      const data: BeratungshilfeFormularUserData = {
        hasBankkonto: "no",
        wurdeVerklagt: "no",
        bankkonten: [
          {
            kontoEigentuemer: "myself",
            bankName: "FooBank",
            kontostand: "199,00",
            iban: "",
          },
        ],
      };

      const minimalConfig = {
        id: "/beratungshilfe/antrag",
        initial: "summary",
        meta: {
          arrays: {
            bankkonten: {
              event: "add-bankkonten",
              url: "/beratungshilfe/antrag/summary/bankkonten",
              initialInputUrl: "daten",
              statementKey: "hasBankkonto",
              isArrayRelevant: (context: BeratungshilfeFormularUserData) =>
                context.wurdeVerklagt === "no",
            },
          },
        },
        states: {
          summary: {
            id: "summary",
            initial: "overview",
            states: {
              overview: {
                on: {
                  SUBMIT: "done",
                  "add-bankkonten": "bankkonten",
                },
              },
              bankkonten: {
                initial: "daten",
                states: {
                  daten: {
                    on: {
                      SUBMIT: "ende",
                      BACK: "#summary.overview",
                    },
                  },
                  ende: {},
                },
              },
              done: {},
            },
          },
        },
      } satisfies Config;

      const validPaths = validFormPaths(
        buildFlowController({ config: minimalConfig, data }),
      );

      expect(validPaths).toContainEqual({
        stepIds: ["/summary/bankkonten/daten", "/summary/bankkonten/ende"],
        arrayIndex: 0,
      });
    });
  });
});
