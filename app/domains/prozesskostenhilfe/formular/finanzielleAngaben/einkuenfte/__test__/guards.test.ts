import { CheckboxValue } from "~/components/inputs/Checkbox";
import { finanzielleAngabeEinkuenfteGuards as guards } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/guards";

describe("Einkünfte guards", () => {
  describe("hasGrundsicherungOrAsylbewerberleistungen", () => {
    it("should return true if the user receives grundsicherung or asylbewerberleistungen", () => {
      expect(
        guards.hasGrundsicherungOrAsylbewerberleistungen({
          context: {
            staatlicheLeistungen: "grundsicherung",
          },
        }),
      ).toBe(true);
    });
  });

  describe("notEmployed", () => {
    it("should return true if the user doesn't receive income for work", () => {
      expect(
        guards.notEmployed({
          context: { currentlyEmployed: "no" },
        }),
      ).toBe(true);
    });
  });

  describe("isEmployee", () => {
    it("should return true if the user receives employment income", () => {
      expect(
        guards.isEmployee({
          context: { employmentType: "employed" },
        }),
      ).toBe(true);
    });

    it("should return true if the user receives employment income AND is self-employed", () => {
      expect(
        guards.isEmployee({
          context: {
            employmentType: "employedAndSelfEmployed",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the user is ONLY self-employed", () => {
      expect(
        guards.isEmployee({
          context: {
            employmentType: "selfEmployed",
          },
        }),
      ).toBe(false);
    });
  });

  describe("isSelfEmployed", () => {
    it("should return true if the user is self-employed", () => {
      expect(
        guards.isSelfEmployed({
          context: { employmentType: "selfEmployed" },
        }),
      ).toBe(true);
    });

    it("should return true if the user receives employment income AND is self-employed", () => {
      expect(
        guards.isSelfEmployed({
          context: {
            employmentType: "employedAndSelfEmployed",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the user is ONLY self-employed", () => {
      expect(
        guards.isSelfEmployed({
          context: {
            employmentType: "employed",
          },
        }),
      ).toBe(false);
    });
  });

  describe("usesPublicTransit", () => {
    it("should return true if the user uses public transit for work", () => {
      expect(
        guards.usesPublicTransit({
          context: { arbeitsweg: "publicTransport" },
        }),
      ).toBe(true);
    });
  });

  describe("usesPrivateVehicle", () => {
    it("should return true if the user uses a private vehicle for work", () => {
      expect(
        guards.usesPrivateVehicle({
          context: { arbeitsweg: "privateVehicle" },
        }),
      ).toBe(true);
    });
  });

  describe("hasAndereArbeitsausgaben", () => {
    it("should return true if the user has additional work-related expenses", () => {
      expect(
        guards.hasAndereArbeitsausgaben({
          context: { hasArbeitsausgaben: "yes" },
        }),
      ).toBe(true);
    });
  });

  describe("hasFurtherIncome", () => {
    it("should return true if the user has additional income", () => {
      expect(
        guards.hasFurtherIncome({
          context: { hasFurtherIncome: "yes" },
        }),
      ).toBe(true);
    });
  });

  describe("receivesPension", () => {
    it("should return true if the user receives a pension", () => {
      expect(
        guards.receivesPension({
          context: { receivesPension: "yes" },
        }),
      ).toBe(true);
    });
  });

  describe("hasWohngeld", () => {
    it("should return true if the user receives wohngeld", () => {
      expect(
        guards.hasWohngeld({
          context: { hasWohngeld: CheckboxValue.on },
        }),
      ).toBe(true);
    });
  });
  describe("hasKrankengeld", () => {
    it("should return true if the user receives krankengeld", () => {
      expect(
        guards.hasKrankengeld({
          context: { hasKrankengeld: CheckboxValue.on },
        }),
      ).toBe(true);
    });
  });
  describe("hasElterngeld", () => {
    it("should return true if the user receives elterngeld", () => {
      expect(
        guards.hasElterngeld({
          context: { hasElterngeld: CheckboxValue.on },
        }),
      ).toBe(true);
    });
  });
  describe("hasKindergeld", () => {
    it("should return true if the user receives kindergeld", () => {
      expect(
        guards.hasKindergeld({
          context: { hasKindergeld: CheckboxValue.on },
        }),
      ).toBe(true);
    });
  });
});
