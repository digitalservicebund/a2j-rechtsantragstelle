import { ArrayData, Context } from "../contexts";
import { getPrunedUserData } from "../pruner";

describe("pruner", () => {
  const grundvoraussetzung: Context = {
    rechtsschutzversicherung: "no",
    wurdeVerklagt: "no",
    klageEingereicht: "no",
    beratungshilfeBeantragt: "no",
    eigeninitiativeGrundvorraussetzung: "no",
    anwaltskanzlei: "no",
  };
  const rechtsproblem: Context = {
    bereich: "authorities",
    gegenseite: "miete",
    beschreibung: "teuer",
    ziel: "billiger",
    eigeninitiativeBeschreibung: "nichts",
  };
  const finanzielleAngaben: Context = {
    staatlicheLeistungen: "keine",
    erwerbstaetig: "yes",
    berufsituation: "no",
    berufart: { selbststaendig: "off", festangestellt: "on" },
    weitereseinkommen: {
      unterhaltszahlungen: "off",
      arbeitlosengeld: "off",
      wohngeld: "off",
      kindergeld: "off",
      bafoeg: "off",
      krankengeld: "off",
      rente: "off",
      elterngeld: "off",
      insolvenzgeld: "off",
      ueberbrueckungsgeld: "off",
      others: "off",
    },
    einkommen: "100,00",
    partnerschaft: "no",
    hasKinder: "no",
    hasWeitereUnterhaltszahlungen: "no",
    livingSituation: "withOthers",
    apartmentSizeSqm: 100,
    apartmentPersonCount: 2,
    apartmentCostFull: "500,00",
    apartmentCostOwnShare: "300,00",
    hasBankkonto: "no",
    hasGeldanlage: "no",
    hasWertsache: "no",
    hasGrundeigentum: "no",
    hasKraftfahrzeug: "no",
    hasAusgaben: "no",
    eigentumTotalWorth: "unsure",
  };

  describe("unreachable steps", () => {
    it("prunes unreachable steps", async () => {
      const prunedData = await getPrunedUserData(
        {
          ...grundvoraussetzung,
          ...rechtsproblem,
          staatlicheLeistungen: "asylbewerberleistungen",
          erwerbstaetig: "no",
          berufsituation: "pupil",
        },
        "/beratungshilfe/antrag",
      );

      ["berufsituation", "erwerbstaetig"].forEach((prunedKey) =>
        expect(Object.keys(prunedData)).not.toContain(prunedKey),
      );
    });

    it("keeps potentially unreachable steps", async () => {
      const prunedData = await getPrunedUserData(
        {
          ...grundvoraussetzung,
          ...rechtsproblem,
          staatlicheLeistungen: "keine",
          erwerbstaetig: "no",
          berufsituation: "pupil",
        },
        "/beratungshilfe/antrag",
      );

      ["berufsituation", "erwerbstaetig"].forEach((prunedKey) =>
        expect(Object.keys(prunedData)).toContain(prunedKey),
      );
    });
  });

  describe("arrays", () => {
    it("prunes arrays", async () => {
      const prunedData = await getPrunedUserData(
        {
          ...grundvoraussetzung,
          ...rechtsproblem,
          ...finanzielleAngaben,
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
      );

      expect(Object.keys(prunedData)).not.toContain("bankkonten");
    });

    it("includes arrays with statement key", async () => {
      const prunedData = await getPrunedUserData(
        {
          ...grundvoraussetzung,
          ...rechtsproblem,
          ...finanzielleAngaben,
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
              kontostand: "299,00",
              iban: "",
              kontoDescription: "second Account",
            },
          ],
        },
        "/beratungshilfe/antrag",
      );

      expect(Object.keys(prunedData)).toContain("bankkonten");
      expect((prunedData.bankkonten as ArrayData).length).toBe(2);
    });

    it("prunes array according to art", async () => {
      const prunedData = await getPrunedUserData(
        {
          ...grundvoraussetzung,
          ...rechtsproblem,
          ...finanzielleAngaben,
          hasGeldanlage: "yes",
          geldanlagen: [
            {
              art: "bargeld",
              eigentuemer: "myself",
              befristetArt: "buildingSavingsContract", // not relevant
              verwendungszweck: "foo", // not relevant
              wert: "1.000,00",
              auszahlungdatum: "20.02.2030", // not relevant
            },
          ],
        },
        "/beratungshilfe/antrag",
      );

      expect(prunedData.geldanlagen).toBeDefined();
      expect((prunedData.geldanlagen as ArrayData)[0].art).toBeDefined();
      expect(
        (prunedData.geldanlagen as ArrayData)[0].eigentuemer,
      ).toBeDefined();
      expect((prunedData.geldanlagen as ArrayData)[0].wert).toBeDefined();

      expect(
        (prunedData.geldanlagen as ArrayData)[0].befristetArt,
      ).toBeUndefined();
      expect(
        (prunedData.geldanlagen as ArrayData)[0].verwendungszweck,
      ).toBeUndefined();
      expect(
        (prunedData.geldanlagen as ArrayData)[0].auszahlungsdatum,
      ).toBeUndefined();
    });
  });
});
