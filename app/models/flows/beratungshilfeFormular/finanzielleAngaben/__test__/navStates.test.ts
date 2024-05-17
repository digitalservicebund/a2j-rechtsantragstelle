import { beratungshilfeFinanzielleAngabeDone } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/navStates";
import * as navStatesEigentum from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/navStatesEigentum";

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
            eigentumTotalWorth: "unsure",
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
            eigentumTotalWorth: "unsure",
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

    it("passes with buergergeld and eigentum done and eigentumZusammenfassung done", () => {
      jest.spyOn(navStatesEigentum, "eigentumDone").mockReturnValue(true);
      jest
        .spyOn(navStatesEigentum, "eigentumZusammenfassungDone")
        .mockReturnValue(true);

      expect(
        beratungshilfeFinanzielleAngabeDone({
          context: {
            staatlicheLeistungen: "buergergeld",
          },
        }),
      ).toBeTruthy();
    });

    it("fails with buergergeld and eigentum done but eigentumZusammenfassung not done", () => {
      jest.spyOn(navStatesEigentum, "eigentumDone").mockReturnValue(true);
      jest
        .spyOn(navStatesEigentum, "eigentumZusammenfassungDone")
        .mockReturnValue(false);

      expect(
        beratungshilfeFinanzielleAngabeDone({
          context: {
            staatlicheLeistungen: "buergergeld",
          },
        }),
      ).toBeFalsy();
    });

    it("fails with buergergeld and eigentum not done but eigentumZusammenfassung done", () => {
      jest.spyOn(navStatesEigentum, "eigentumDone").mockReturnValue(false);
      jest
        .spyOn(navStatesEigentum, "eigentumZusammenfassungDone")
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
            eigentumTotalWorth: "unsure",
          },
        }),
      ).toBeFalsy();
    });
  });
});
