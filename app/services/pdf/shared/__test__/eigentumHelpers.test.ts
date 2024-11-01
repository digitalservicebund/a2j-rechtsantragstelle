import type { BankkontenArraySchema } from "~/domains/shared/finanzielleAngaben/context";
import type { AttachmentEntries } from "~/services/pdf/attachment";
import { attachBankkontenToAnhang } from "../eigentumHelpers";

describe("eigentumHelpers", () => {
  describe("attachBankkontenToAnhang", () => {
    it("should add a header to the attachment", () => {
      const attachment: AttachmentEntries = [];
      const bankkonten: BankkontenArraySchema = [];
      const { attachment: result } = attachBankkontenToAnhang(
        attachment,
        bankkonten,
      );
      expect(result).toContainEqual({ title: "Bankkonten", level: "h3" });
    });

    it("should add a bankkonto without description or iban", () => {
      const attachment: AttachmentEntries = [];
      const bankkonten: BankkontenArraySchema = [
        {
          bankName: "Bank1",
          kontoEigentuemer: "myself",
          kontostand: "2222",
        },
      ];
      const { attachment: result } = attachBankkontenToAnhang(
        attachment,
        bankkonten,
      );
      expect(result).toContainEqual({ title: "Bankkonto 1", level: "h4" });
      expect(result).toContainEqual({ title: "Bank", text: "Bank1" });
      expect(result).toContainEqual({ title: "Inhaber", text: "Ich alleine" });
    });

    it("should add a bankkonto with description and iban", () => {
      const attachment: AttachmentEntries = [];
      const bankkonten: BankkontenArraySchema = [
        {
          bankName: "Bank1",
          kontoEigentuemer: "myself",
          kontostand: "2222",
          kontoDescription: "Beschreibung",
          iban: "DE123456789",
        },
      ];
      const { attachment: result } = attachBankkontenToAnhang(
        attachment,
        bankkonten,
      );
      expect(result).toContainEqual({ title: "Bankkonto 1", level: "h4" });
      expect(result).toContainEqual({ title: "Bank", text: "Bank1" });
      expect(result).toContainEqual({ title: "Inhaber", text: "Ich alleine" });
      expect(result).toContainEqual({
        title: "Beschreibung",
        text: "Beschreibung",
      });
      expect(result).toContainEqual({ title: "Iban", text: "DE123456789" });
    });

    it("should add two bankkontos", () => {
      const attachment: AttachmentEntries = [];
      const bankkonten: BankkontenArraySchema = [
        {
          bankName: "Bank1",
          kontoEigentuemer: "myself",
          kontostand: "2222",
          kontoDescription: "Beschreibung",
          iban: "DE123456789",
        },
        {
          bankName: "Bank2",
          kontoEigentuemer: "myself",
          kontostand: "2222",
          kontoDescription: "Beschreibung",
          iban: "DE123456789",
        },
      ];
      const { attachment: result } = attachBankkontenToAnhang(
        attachment,
        bankkonten,
      );
      expect(result).toContainEqual({ title: "Bankkonto 1", level: "h4" });
      expect(result).toContainEqual({ title: "Bank", text: "Bank1" });
      expect(result).toContainEqual({ title: "Inhaber", text: "Ich alleine" });
      expect(result).toContainEqual({
        title: "Beschreibung",
        text: "Beschreibung",
      });
      expect(result).toContainEqual({ title: "Iban", text: "DE123456789" });
      expect(result).toContainEqual({ title: "Bankkonto 2", level: "h4" });
      expect(result).toContainEqual({ title: "Bank", text: "Bank2" });
      expect(result).toContainEqual({ title: "Inhaber", text: "Ich alleine" });
      expect(result).toContainEqual({
        title: "Beschreibung",
        text: "Beschreibung",
      });
      expect(result).toContainEqual({ title: "Iban", text: "DE123456789" });
    });
  });
});
