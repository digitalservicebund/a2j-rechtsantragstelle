import type { BeratungshilfeFormularContext } from "app/flows/beratungshilfe/formular";
import { getStrapiEntry } from "~/services/cms/getStrapiEntry";
import type { StrapiSchemas } from "~/services/cms/schemas";
import { filterFormFields, pruneIrrelevantData } from "../pruner";

vi.mock("~/services/cms/getStrapiEntry");

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
      const strapiEntries = [
        {
          attributes: { stepId: "/start", form: [] },
        },
        {
          attributes: {
            stepId: "/grundvoraussetzungen/rechtsschutzversicherung",
            form: [{ name: "rechtsschutzversicherung" }],
          },
        },
        {
          attributes: {
            stepId: "/grundvoraussetzungen/wurde-verklagt",
            form: [{ name: "wurdeVerklagt" }],
          },
        },
        {
          attributes: {
            stepId: "/grundvoraussetzungen/klage-eingereicht",
            form: [{ name: "klageEingereicht" }],
          },
        },
        {
          attributes: {
            stepId: "/grundvoraussetzungen/beratungshilfe-beantragt",
            form: [{ name: "beratungshilfeBeantragt" }],
          },
        },
        {
          attributes: {
            stepId: "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung",
            form: [{ name: "eigeninitiativeGrundvorraussetzung" }],
          },
        },
        {
          attributes: {
            stepId: "/finanzielle-angaben/einkommen/staatliche-leistungen",
            form: [{ name: "staatlicheLeistungen" }],
          },
        },
        {
          attributes: {
            stepId: "/finanzielle-angaben/eigentum/bankkonten-frage",
            form: [{ name: "hasBankkonto" }],
          },
        },
        {
          attributes: {
            stepId: "/finanzielle-angaben/eigentum/geldanlagen-frage",
            form: [{ name: "hasGeldanlage" }],
          },
        },
        {
          attributes: {
            stepId: "/finanzielle-angaben/eigentum/wertgegenstaende-frage",
            form: [{ name: "hasWertsache" }],
          },
        },
        {
          attributes: {
            stepId: "/finanzielle-angaben/eigentum/grundeigentum-frage",
            form: [{ name: "hasGrundeigentum" }],
          },
        },
        {
          attributes: {
            stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
            form: [{ name: "hasKraftfahrzeug" }],
          },
        },
        {
          attributes: {
            stepId: "/finanzielle-angaben/eigentum/gesamtwert",
            form: [{ name: "eigentumTotalWorth" }],
          },
        },
        {
          attributes: {
            stepId:
              "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
            form: [{ name: "geldanlagen#art" }],
          },
        },
        {
          attributes: {
            stepId:
              "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/forderung",
            form: [
              { name: "geldanlagen#forderung" },
              { name: "geldanlagen#eigentuemer" },
              { name: "geldanlagen#wert" },
            ],
          },
        },
        {
          attributes: {
            stepId:
              "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/befristet",
            form: [
              { name: "geldanlagen#eigentuemer" },
              { name: "geldanlagen#befristetArt" },
              { name: "geldanlagen#verwendungszweck" },
              { name: "geldanlagen#wert" },
              { name: "geldanlagen#auszahlungdatum" },
            ],
          },
        },
        {
          attributes: {
            stepId:
              "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/bargeld",
            form: [
              { name: "geldanlagen#eigentuemer" },
              { name: "geldanlagen#wert" },
            ],
          },
        },
      ];

      vi.mocked(getStrapiEntry).mockReturnValue(
        Promise.resolve(strapiEntries as StrapiSchemas["form-flow-pages"]),
      );

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

      const prunedData = await pruneIrrelevantData(userData, flowId);
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
