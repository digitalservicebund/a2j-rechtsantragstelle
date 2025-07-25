import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { flows } from "~/domains/flows.server";
import { buildFlowController } from "../server/buildFlowController";
import { validFormPaths } from "../validFormPaths";

describe("validFormPaths", () => {
  const { config, guards } = flows["/beratungshilfe/antrag"];

  it("returns base path with reachable steps", () => {
    const data: BeratungshilfeFormularUserData = {
      rechtsschutzversicherung: "no",
    };
    expect(
      validFormPaths(buildFlowController({ config, guards, data })),
    ).toStrictEqual([
      {
        stepIds: [
          "/start/start",
          "/grundvoraussetzungen/start",
          "/grundvoraussetzungen/rechtsschutzversicherung",
          "/grundvoraussetzungen/wurde-verklagt",
          "/grundvoraussetzungen/wurde-verklagt-hinweis",
        ],
      },
    ]);
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
      const validPaths = validFormPaths(
        buildFlowController({ config, guards, data }),
      );
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
      const validPaths = validFormPaths(
        buildFlowController({ config, guards, data }),
      );
      expect(validPaths.length).toStrictEqual(1);
    });

    it("excludes array with empty array but statement key 'yes'", () => {
      const data = { ...baseData, hasBankkonto: "yes", bankkonten: [] };
      const validPaths = validFormPaths(
        buildFlowController({ config, guards, data }),
      );
      expect(validPaths.length).toStrictEqual(1);
    });
    it("excludes array with undefined array but statement key 'yes'", () => {
      const data = { ...baseData, hasBankkonto: "yes", bankkonten: undefined };
      const validPaths = validFormPaths(
        buildFlowController({ config, guards, data }),
      );
      expect(validPaths.length).toStrictEqual(1);
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
      const validPaths = validFormPaths(
        buildFlowController({ config, guards, data }),
      );
      expect(validPaths.length).toStrictEqual(1);
    });
  });
});
