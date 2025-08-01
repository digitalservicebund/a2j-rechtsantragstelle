import { beratungshilfeFinanzielleAngabeDone } from "../beratungshilfeFinanzielleAngabeDone";
import * as eigentumDone from "../doneFunctions";

describe("navStates", () => {
  afterEach(() => {
    vi.restoreAllMocks();
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
          },
        }),
      ).toBeTruthy();
    });

    test("passes with keine and reduced info", () => {
      expect(
        beratungshilfeFinanzielleAngabeDone({
          context: {
            staatlicheLeistungen: "keine",
            hasKinder: "no",
            hasBankkonto: "no",
            hasGeldanlage: "no",
            hasGrundeigentum: "no",
            hasKraftfahrzeug: "no",
            hasWertsache: "no",
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

    it("passes with buergergeld and eigentum done", () => {
      vi.spyOn(eigentumDone, "eigentumDone").mockReturnValue(true);

      expect(
        beratungshilfeFinanzielleAngabeDone({
          context: {
            staatlicheLeistungen: "buergergeld",
          },
        }),
      ).toBeTruthy();
    });

    it("fails with buergergeld and eigentum not done", () => {
      vi.spyOn(eigentumDone, "eigentumDone").mockReturnValue(false);

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
          },
        }),
      ).toBeFalsy();
    });
  });
});
