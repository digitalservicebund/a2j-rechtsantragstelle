import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { filterFormFields, pruneIrrelevantData } from "../pruner";
import * as getAllFieldsFromFlowId from "~/domains/pageSchemas";
import * as validFormPathsModule from "../validFormPaths";

describe("pruner", () => {
  describe("filterFormFields", () => {
    it("returns form field names", () => {
      const result = filterFormFields(
        { "/step1": ["field1"], "/step2": ["field2"] },
        [{ stepIds: ["/step1", "/step2"] }],
      );

      expect(result).toEqual(["field1", "field2"]);
    });

    it("returns form field names for multiple forms within one flowPage", () => {
      const result = filterFormFields(
        { "/step1": ["field1", "field2", "field3"] },
        [{ stepIds: ["/step1"] }],
      );
      expect(result).toEqual(["field1", "field2", "field3"]);
    });

    it("keeps array index", () => {
      const result = filterFormFields(
        {
          "/step1": ["field1"],
          "/step1a": ["field1#a"],
          "/step2a": ["field2#a"],
          "/step1b": ["field1#b", "field1#b1"],
        },
        [
          { stepIds: ["/step1"] },
          { stepIds: ["/step1a", "/step2a"], arrayIndex: 0 },
          { stepIds: ["/step1b"], arrayIndex: 1 },
        ],
      );

      expect(result).toEqual([
        "field1",
        "field1[0]a",
        "field2[0]a",
        "field1[1]b",
        "field1[1]b1",
      ]);
    });
  });

  describe("pruneIrrelevantData", () => {
    it("prunes irrelevant data", () => {
      // Mock the config-derived pieces so the pruning logic is exercised
      // independently of any flow's engine. Reachable pages: the grundvor /
      // statement questions plus the geldanlagen array (two entries); the
      // bankkonten and kinder arrays are not reachable, so they get pruned.
      const getFieldsSpy = vi
        .spyOn(getAllFieldsFromFlowId, "getAllFieldsFromFlowId")
        .mockReturnValue({
          "/grundvoraussetzungen": [
            "rechtsschutzversicherung",
            "wurdeVerklagt",
            "klageEingereicht",
            "beratungshilfeBeantragt",
            "eigeninitiativeGrundvorraussetzung",
          ],
          "/einkommen": ["staatlicheLeistungen"],
          "/bankkonten-frage": ["hasBankkonto"],
          "/geldanlagen-frage": ["hasGeldanlage"],
          "/wertsachen-frage": ["hasWertsache"],
          "/grundeigentum-frage": ["hasGrundeigentum"],
          "/kraftfahrzeuge-frage": ["hasKraftfahrzeug"],
          "/kinder-frage": ["hasKinder"],
          "/geldanlage": [
            "geldanlagen#art",
            "geldanlagen#eigentuemer",
            "geldanlagen#befristetArt",
            "geldanlagen#verwendungszweck",
            "geldanlagen#wert",
            "geldanlagen#auszahlungdatum",
          ],
        });
      const validPathsSpy = vi
        .spyOn(validFormPathsModule, "validFormPaths")
        .mockReturnValue([
          {
            stepIds: [
              "/grundvoraussetzungen",
              "/einkommen",
              "/bankkonten-frage",
              "/geldanlagen-frage",
              "/wertsachen-frage",
              "/grundeigentum-frage",
              "/kraftfahrzeuge-frage",
              "/kinder-frage",
            ],
          },
          { stepIds: ["/geldanlage"], arrayIndex: 0 },
          { stepIds: ["/geldanlage"], arrayIndex: 1 },
        ]);

      const userData: BeratungshilfeFormularUserData = {
        rechtsschutzversicherung: "no",
        wurdeVerklagt: "no",
        klageEingereicht: "no",
        beratungshilfeBeantragt: "no",
        eigeninitiativeGrundvorraussetzung: "no",
        staatlicheLeistungen: "keine",
        hasBankkonto: "no",
        hasGeldanlage: "yes",
        hasWertsache: "no",
        hasGrundeigentum: "no",
        hasKraftfahrzeug: "no",
        bankkonten: [
          {
            bankName: "asd",
            kontoEigentuemer: "myself",
            kontostand: "123",
            iban: "",
          },
        ],
        geldanlagen: [
          {
            art: "befristet",
            eigentuemer: "partner",
            befristetArt: "lifeInsurance",
            verwendungszweck: "123",
            wert: "123",
            auszahlungdatum: "11.11.2032",
          },
          {
            art: "bargeld",
            eigentuemer: "partner",
            wert: "123",
          },
        ],
        hasKinder: "no",
        kinder: [
          {
            vorname: "a",
            nachname: "b",
            geburtsdatum: "11.11.2023",
            wohnortBeiAntragsteller: "no",
            unterhalt: "yes",
            unterhaltsSumme: "123",
          },
        ],
        pageData: { arrayIndexes: [1], subflowDoneStates: { "/a": true } },
      };
      const flowId = "/beratungshilfe/antrag";

      const { prunedData } = pruneIrrelevantData(userData, flowId);
      expect(prunedData).toStrictEqual({
        rechtsschutzversicherung: "no",
        wurdeVerklagt: "no",
        klageEingereicht: "no",
        beratungshilfeBeantragt: "no",
        eigeninitiativeGrundvorraussetzung: "no",
        staatlicheLeistungen: "keine",
        hasBankkonto: "no",
        hasKinder: "no",
        hasGeldanlage: "yes",
        hasWertsache: "no",
        hasGrundeigentum: "no",
        hasKraftfahrzeug: "no",
        geldanlagen: [
          {
            art: "befristet",
            eigentuemer: "partner",
            befristetArt: "lifeInsurance",
            verwendungszweck: "123",
            wert: "123",
            auszahlungdatum: "11.11.2032",
          },
          {
            art: "bargeld",
            wert: "123",
            eigentuemer: "partner",
          },
        ],
        pageData: { subflowDoneStates: { "/a": true } },
      });

      getFieldsSpy.mockRestore();
      validPathsSpy.mockRestore();
    });

    it("keeps array fields when valid paths include an array page", () => {
      const getFieldsSpy = vi
        .spyOn(getAllFieldsFromFlowId, "getAllFieldsFromFlowId")
        .mockReturnValue({
          "/start": ["hasBankkonto"],
          "/bankkonten/bankkonto/daten": ["bankkonten#kontoEigentuemer"],
        });

      const validPathsSpy = vi
        .spyOn(validFormPathsModule, "validFormPaths")
        .mockReturnValue([
          { stepIds: ["/start"] },
          {
            stepIds: ["/bankkonten/bankkonto/daten"],
            arrayIndex: 0,
          },
        ]);

      const userData = {
        hasBankkonto: "no",
        "bankkonten[0]kontoEigentuemer": "myself",
        irrelevant: "remove-me",
      };

      const { prunedData, validFlowPaths } = pruneIrrelevantData(
        userData,
        "/beratungshilfe/antrag",
      );

      expect(validPathsSpy).toHaveBeenCalled();

      expect(prunedData).toStrictEqual({
        hasBankkonto: "no",
        "bankkonten[0]kontoEigentuemer": "myself",
      });

      expect(validFlowPaths).toEqual({
        "/start": { isArrayPage: false },
        "/bankkonten/bankkonto/daten": { isArrayPage: true },
      });

      getFieldsSpy.mockRestore();
      validPathsSpy.mockRestore();
    });
  });

  it("should return the paths and if the path is an array page given a context and flowId", () => {
    vi.spyOn(getAllFieldsFromFlowId, "getAllFieldsFromFlowId").mockReturnValue({
      "/grundvoraussetzungen/rechtsschutzversicherung": [
        "rechtsschutzversicherung",
      ],
      "/grundvoraussetzungen/wurde-verklagt": ["wurdeVerklagt"],
      "/grundvoraussetzungen/klage-eingereicht": ["klageEingereicht"],
      "/grundvoraussetzungen/beratungshilfe-beantragt": [
        "beratungshilfeBeantragt",
      ],
      "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung": [
        "eigeninitiativeGrundvorraussetzung",
      ],
      "/finanzielle-angaben/einkommen/staatliche-leistungen": [
        "staatlicheLeistungen",
      ],
      "/finanzielle-angaben/kinder/kinder-frage": ["hasKinder"],
      "/finanzielle-angaben/kinder/kinder/name": [
        "kinder#vorname",
        "kinder#nachname",
        "kinder#geburtsdatum",
      ],
    });

    // Mock the reachable paths so this stays independent of the flow's engine.
    vi.spyOn(validFormPathsModule, "validFormPaths").mockReturnValue([
      {
        stepIds: [
          "/grundvoraussetzungen/rechtsschutzversicherung",
          "/grundvoraussetzungen/wurde-verklagt",
          "/grundvoraussetzungen/klage-eingereicht",
          "/grundvoraussetzungen/beratungshilfe-beantragt",
          "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung",
          "/finanzielle-angaben/einkommen/staatliche-leistungen",
          "/finanzielle-angaben/kinder/kinder-frage",
        ],
      },
      { stepIds: ["/finanzielle-angaben/kinder/kinder/name"], arrayIndex: 0 },
    ]);

    const userData = {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "no",
      klageEingereicht: "no",
      beratungshilfeBeantragt: "no",
      eigeninitiativeGrundvorraussetzung: "no",
      staatlicheLeistungen: "keine",
      hasKinder: "yes",
      kinder: [
        {
          vorname: "a",
          nachname: "b",
          geburtsdatum: "11.11.2023",
          wohnortBeiAntragsteller: "yes",
          eigeneEinnahmen: "yes",
          einnahmen: "100",
        },
      ],
    } satisfies BeratungshilfeFormularUserData;
    const flowId = "/beratungshilfe/antrag";

    const { validFlowPaths } = pruneIrrelevantData(userData, flowId);

    expect(validFlowPaths).toEqual({
      "/grundvoraussetzungen/klage-eingereicht": {
        isArrayPage: false,
      },
      "/grundvoraussetzungen/rechtsschutzversicherung": {
        isArrayPage: false,
      },
      "/grundvoraussetzungen/wurde-verklagt": {
        isArrayPage: false,
      },
      "/finanzielle-angaben/einkommen/staatliche-leistungen": {
        isArrayPage: false,
      },
      "/finanzielle-angaben/kinder/kinder-frage": {
        isArrayPage: false,
      },
      "/finanzielle-angaben/kinder/kinder/name": {
        isArrayPage: true,
      },
      "/grundvoraussetzungen/beratungshilfe-beantragt": {
        isArrayPage: false,
      },
      "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung": {
        isArrayPage: false,
      },
    });
  });
});
