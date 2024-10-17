import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { filterFormFields, pruneIrrelevantData } from "../pruner";

describe("pruner", () => {
  describe("filterFormFields", () => {
    it("returns form field names", () => {
      const result = filterFormFields(
        { "/step1": ["field1"], "/step2": ["field2"] },
        [{ stepIds: ["step1", "step2"] }],
      );

      expect(result).toEqual(["field1", "field2"]);
    });

    it("returns form field names for multiple forms within one flowPage", () => {
      const result = filterFormFields(
        { "/step1": ["field1", "field2", "field3"] },
        [{ stepIds: ["step1"] }],
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
          { stepIds: ["step1"] },
          { stepIds: ["step1a", "step2a"], arrayIndex: 0 },
          { stepIds: ["step1b"], arrayIndex: 1 },
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
    it("prunes irrelevant data", async () => {
      const formFields = {
        "/grundvoraussetzungen/beratungshilfe-beantragt": [
          "beratungshilfeBeantragt",
        ],
        "/grundvoraussetzungen/rechtsschutzversicherung": [
          "rechtsschutzversicherung",
        ],
        "/grundvoraussetzungen/wurde-verklagt": ["wurdeVerklagt"],
        "/grundvoraussetzungen/klage-eingereicht": ["klageEingereicht"],
        "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung": [
          "eigeninitiativeGrundvorraussetzung",
        ],
        "/finanzielle-angaben/einkommen/staatliche-leistungen": [
          "staatlicheLeistungen",
        ],
        "/finanzielle-angaben/eigentum/bankkonten-frage": ["hasBankkonto"],
        "/finanzielle-angaben/eigentum/geldanlagen-frage": ["hasGeldanlage"],
        "/finanzielle-angaben/eigentum/wertgegenstaende-frage": [
          "hasWertsache",
        ],
        "/finanzielle-angaben/eigentum/grundeigentum-frage": [
          "hasGrundeigentum",
        ],
        "/finanzielle-angaben/eigentum/kraftfahrzeuge-frage": [
          "hasKraftfahrzeug",
        ],
        "/finanzielle-angaben/eigentum/gesamtwert": ["eigentumTotalWorth"],
        "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art": [
          "geldanlagen#art",
        ],
        "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/forderung": [
          "geldanlagen#forderung",
          "geldanlagen#eigentuemer",
          "geldanlagen#wert",
        ],
        "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/befristet": [
          "geldanlagen#eigentuemer",
          "geldanlagen#befristetArt",
          "geldanlagen#verwendungszweck",
          "geldanlagen#wert",
          "geldanlagen#auszahlungdatum",
        ],
        "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/bargeld": [
          "geldanlagen#eigentuemer",
          "geldanlagen#wert",
        ],
      };

      const userData = {
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
        eigentumTotalWorth: "more10000",
        bankkonten: [
          { bankName: "asd", kontoEigentuemer: "myself", kontostand: "123" },
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
            befristetArt: "lifeInsurance",
            verwendungszweck: "123",
            wert: "123",
            auszahlungdatum: "11.11.2032",
          },
        ],
        hasKinder: "no",
        kinder: [
          {
            vorname: "a",
            nachname: "b",
            geburtsdatum: "11.11.2023",
            wohnortBeiAntragsteller: "no",
            unterhalt: "no",
            unterhaltsSumme: "123",
            eigeneEinnahmen: "no",
            einnahmen: "0",
          },
        ],
      } satisfies BeratungshilfeFormularContext;
      const flowId = "/beratungshilfe/antrag";

      const prunedData = await pruneIrrelevantData(
        userData,
        flowId,
        formFields,
      );
      expect(prunedData).toStrictEqual({
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
        eigentumTotalWorth: "more10000",
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
      });
    });
  });
});
