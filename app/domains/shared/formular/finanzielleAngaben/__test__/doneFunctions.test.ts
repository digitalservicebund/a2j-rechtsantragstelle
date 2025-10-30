import {
  bankKontoDone,
  geldanlageDone,
} from "~/domains/shared/formular/finanzielleAngaben/doneFunctions";
import type { GeldanlagenArraySchema } from "~/domains/shared/formular/finanzielleAngaben/userData";

const mockCompletedAnlage: GeldanlagenArraySchema[0] = {
  art: "bargeld",
  eigentuemer: "partner",
  wert: "100",
};

describe("shared finanzielle angaben doneFunctions", () => {
  describe("bankKontoDone", () => {
    it("passes with bankkonto no", () => {
      expect(bankKontoDone({ context: { hasBankkonto: "no" } })).toBeTruthy();
    });

    it("fails with bankkonto yes but no bankkonten key given", () => {
      expect(bankKontoDone({ context: { hasBankkonto: "yes" } })).toBeFalsy();
    });

    it("fails with bankkonto yes but bankkonten is empty list", () => {
      expect(
        bankKontoDone({ context: { hasBankkonto: "yes", bankkonten: [] } }),
      ).toBeFalsy();
    });

    it("passes with bankkonto yes and bankkonten given", () => {
      const validKontoItem = {
        bankName: "bank",
        kontostand: "200",
        iban: "iban",
        kontoEigentuemer: "myself",
      } as const;
      expect(
        bankKontoDone({
          context: { hasBankkonto: "yes", bankkonten: [validKontoItem] },
        }),
      ).toBeTruthy();
    });

    it("fails with all fields missing", () => {
      expect(bankKontoDone({ context: {} })).toBeFalsy();
    });
  });

  describe("geldanlageDone", () => {
    it("should return false if the type is missing", () => {
      expect(geldanlageDone({ ...mockCompletedAnlage, art: undefined })).toBe(
        false,
      );
    });

    it("should return false if the eigentumer is missing", () => {
      expect(
        geldanlageDone({ ...mockCompletedAnlage, eigentuemer: undefined }),
      ).toBe(false);
    });

    it("should return false if the wert is missing", () => {
      expect(geldanlageDone({ ...mockCompletedAnlage, wert: undefined })).toBe(
        false,
      );
    });

    it("should return false if it's a bank account and lacks a name", () => {
      expect(
        geldanlageDone({
          ...mockCompletedAnlage,
          art: "giroTagesgeldSparkonto",
          kontoBankName: undefined,
        }),
      ).toBe(false);
    });

    it("should return false if it's befristet and lacks a type, description or date", () => {
      expect(
        geldanlageDone({
          ...mockCompletedAnlage,
          art: "befristet",
          befristetArt: undefined,
        }),
      ).toBe(false);
      expect(
        geldanlageDone({
          ...mockCompletedAnlage,
          art: "befristet",
          verwendungszweck: undefined,
        }),
      ).toBe(false);
      expect(
        geldanlageDone({
          ...mockCompletedAnlage,
          art: "befristet",
          auszahlungdatum: undefined,
        }),
      ).toBe(false);
    });

    it("should return false if it's support and lacks a description", () => {
      expect(
        geldanlageDone({
          ...mockCompletedAnlage,
          art: "forderung",
          forderung: undefined,
        }),
      ).toBe(false);
    });

    it("should return false if it's sonstiges and lacks a description", () => {
      expect(
        geldanlageDone({
          ...mockCompletedAnlage,
          art: "sonstiges",
          verwendungszweck: undefined,
        }),
      ).toBe(false);
    });

    it("should return true if the user entered a completed geldanlage", () => {
      expect(geldanlageDone(mockCompletedAnlage)).toBe(true);
    });
  });
});
