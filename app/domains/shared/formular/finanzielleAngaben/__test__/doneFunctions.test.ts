import { bankKontoDone } from "~/domains/shared/formular/finanzielleAngaben/doneFunctions";

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
});
