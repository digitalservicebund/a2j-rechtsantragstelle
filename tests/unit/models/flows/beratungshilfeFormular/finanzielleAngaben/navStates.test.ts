import { beratungshilfeFinanzielleAngabeDone } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/navStates";
import * as navStatesBesitz from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/navStatesBesitz";

describe("navStates", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

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
            hasWeitereUnterhaltszahlungen: "no",
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
            hasWeitereUnterhaltszahlungen: "no",
            partnerschaft: "no",
          },
        }),
      ).toBeTruthy();
    });

    it("passes with buergergeld and besitz done and besitzZusammenfassung done", () => {
      jest.spyOn(navStatesBesitz, "besitzDone").mockReturnValue(true);
      jest
        .spyOn(navStatesBesitz, "besitzZusammenfassungDone")
        .mockReturnValue(true);

      expect(
        beratungshilfeFinanzielleAngabeDone({
          context: {
            staatlicheLeistungen: "buergergeld",
          },
        }),
      ).toBeTruthy();
    });

    it("fails with buergergeld and besitz done but besitzZusammenfassung not done", () => {
      jest.spyOn(navStatesBesitz, "besitzDone").mockReturnValue(true);
      jest
        .spyOn(navStatesBesitz, "besitzZusammenfassungDone")
        .mockReturnValue(false);

      expect(
        beratungshilfeFinanzielleAngabeDone({
          context: {
            staatlicheLeistungen: "buergergeld",
          },
        }),
      ).toBeFalsy();
    });

    it("fails with buergergeld and besitz not done but besitzZusammenfassung done", () => {
      jest.spyOn(navStatesBesitz, "besitzDone").mockReturnValue(false);
      jest
        .spyOn(navStatesBesitz, "besitzZusammenfassungDone")
        .mockReturnValue(true);

      expect(
        beratungshilfeFinanzielleAngabeDone({
          context: {
            staatlicheLeistungen: "buergergeld",
          },
        }),
      ).toBeFalsy();
    });

    it("fails with staatlicheLeistungen keine and reduced info", () => {
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
          },
        }),
      ).toBeFalsy();
    });
  });
});
