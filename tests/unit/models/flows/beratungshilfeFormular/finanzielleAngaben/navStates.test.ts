import {
  beratungshilfeFinanzielleAngabeDone,
  beratungshilfeFinanzielleAngabenSubflowState,
} from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/navStates";

describe("navStates", () => {
  describe("beratungshilfeFinanzielleAngabeDone", () => {
    test("passes with only grundsicherung", () => {
      expect(
        beratungshilfeFinanzielleAngabeDone({
          context: { staatlicheLeistungen: "grundsicherung" },
        }),
      ).toBeTruthy();
    });

    test("passes with asylbewerberleistungen", () => {
      expect(
        beratungshilfeFinanzielleAngabeDone({
          context: { staatlicheLeistungen: "asylbewerberleistungen" },
        }),
      ).toBeTruthy();
    });

    test("passes with buergergeld and reduced info", () => {
      expect(
        beratungshilfeFinanzielleAngabeDone({
          context: {
            staatlicheLeistungen: "buergergeld",
            hasBankkonto: "no",
            hasGeldanlage: "no",
            hasGrundeigentum: "no",
            hasKraftfahrzeug: "no",
            hasWertsache: "no",
            besitzTotalWorth: "unsure",
          },
        }),
      ).toBeTruthy();
    });

    test("passes with andereLeistung and reduced info", () => {
      expect(
        beratungshilfeFinanzielleAngabeDone({
          context: {
            staatlicheLeistungen: "andereLeistung",
            hasBankkonto: "no",
            hasGeldanlage: "no",
            hasGrundeigentum: "no",
            hasKraftfahrzeug: "no",
            hasWertsache: "no",
            besitzTotalWorth: "unsure",
            einkommen: "100",
            livingSituation: "alone",
            apartmentSizeSqm: 100,
            apartmentCostAlone: "100",
            hasOtherMaintenancePayments: "no",
            partnerschaft: "no",
          },
        }),
      ).toBeTruthy();
    });

    test("passes with keine and reduced info", () => {
      expect(
        beratungshilfeFinanzielleAngabeDone({
          context: {
            staatlicheLeistungen: "keine",
            hasBankkonto: "no",
            hasGeldanlage: "no",
            hasGrundeigentum: "no",
            hasKraftfahrzeug: "no",
            hasWertsache: "no",
            besitzTotalWorth: "unsure",
            einkommen: "100",
            livingSituation: "alone",
            apartmentSizeSqm: 100,
            apartmentCostAlone: "100",
            hasOtherMaintenancePayments: "no",
            partnerschaft: "no",
          },
        }),
      ).toBeTruthy();
    });
  });

  describe("beratungshilfeFinanzielleAngabenSubflowState", () => {
    it("should return done for the subflow andere-unterhaltszahlungen when hasOtherMaintenancePayments is no", () => {
      const actual = beratungshilfeFinanzielleAngabenSubflowState(
        {
          hasOtherMaintenancePayments: "no",
        },
        "andere-unterhaltszahlungen",
      );

      expect(actual).toEqual("Done");
    });

    it("should return open for the subflow andere-unterhaltszahlungen when hasOtherMaintenancePayments is yes and missing unterhaltszahlungen data", () => {
      const actual = beratungshilfeFinanzielleAngabenSubflowState(
        {
          hasOtherMaintenancePayments: "yes",
        },
        "andere-unterhaltszahlungen",
      );

      expect(actual).toEqual("Open");
    });

    it("should return done for the subflow andere-unterhaltszahlungen when hasOtherMaintenancePayments is yes and unterhaltszahlungen data", () => {
      const actual = beratungshilfeFinanzielleAngabenSubflowState(
        {
          hasOtherMaintenancePayments: "yes",
          unterhaltszahlungen: [
            {
              birthday: "10.10.2020",
              familyRelationship: "mother",
              firstName: "firstName",
              monthlyPayment: "100",
              surname: "surname",
            },
          ],
        },
        "andere-unterhaltszahlungen",
      );

      expect(actual).toEqual("Done");
    });
  });
});
