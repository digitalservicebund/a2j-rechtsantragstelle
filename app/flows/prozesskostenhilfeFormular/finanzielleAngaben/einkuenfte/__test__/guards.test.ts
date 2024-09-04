import { happyPathData } from "tests/fixtures/prozesskostenhilfeFormularData";
import {
  hasAndereArbeitsausgaben,
  hasGrundsicherungOrAsylbewerberleistungen,
  isEmployee,
  isSelfEmployed,
  notEmployed,
  usesPrivateVehicle,
  usesPublicTransit,
} from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";

describe("Einkünfte guards", () => {
  describe("hasGrundsicherungOrAsylbewerberleistungen", () => {
    it("should return true if the user receives grundsicherung or asylbewerberleistungen", () => {
      expect(
        hasGrundsicherungOrAsylbewerberleistungen({
          context: {
            ...happyPathData,
            staatlicheLeistungenPKH: "grundsicherung",
          },
        }),
      ).toBe(true);
    });
  });

  describe("notEmployed", () => {
    it("should return true if the user doesn't receive income for work", () => {
      expect(
        notEmployed({
          context: { ...happyPathData, currentlyEmployed: "no" },
        }),
      ).toBe(true);
    });
  });

  describe("isEmployee", () => {
    it("should return true if the user receives employment income", () => {
      expect(
        isEmployee({
          context: { ...happyPathData, employmentType: "employed" },
        }),
      ).toBe(true);
    });

    it("should return true if the user receives employment income AND is self-employed", () => {
      expect(
        isEmployee({
          context: {
            ...happyPathData,
            employmentType: "employedAndSelfEmployed",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the user is ONLY self-employed", () => {
      expect(
        isEmployee({
          context: {
            ...happyPathData,
            employmentType: "selfEmployed",
          },
        }),
      ).toBe(false);
    });
  });

  describe("isSelfEmployed", () => {
    it("should return true if the user is self-employed", () => {
      expect(
        isSelfEmployed({
          context: { ...happyPathData, employmentType: "selfEmployed" },
        }),
      ).toBe(true);
    });

    it("should return true if the user receives employment income AND is self-employed", () => {
      expect(
        isSelfEmployed({
          context: {
            ...happyPathData,
            employmentType: "employedAndSelfEmployed",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the user is ONLY self-employed", () => {
      expect(
        isSelfEmployed({
          context: {
            ...happyPathData,
            employmentType: "employed",
          },
        }),
      ).toBe(false);
    });
  });

  describe("usesPublicTransit", () => {
    it("should return true if the user uses public transit for work", () => {
      expect(
        usesPublicTransit({
          context: { ...happyPathData, arbeitsweg: "publicTransport" },
        }),
      ).toBe(true);
    });
  });

  describe("usesPrivateVehicle", () => {
    it("should return true if the user uses a private vehicle for work", () => {
      expect(
        usesPrivateVehicle({
          context: { ...happyPathData, arbeitsweg: "privateVehicle" },
        }),
      ).toBe(true);
    });
  });

  describe("hasAndereArbeitsausgaben", () => {
    it("should return true if the user has additional work-related expenses", () => {
      expect(
        hasAndereArbeitsausgaben({
          context: { ...happyPathData, hasArbeitsausgaben: "yes" },
        }),
      ).toBe(true);
    });
  });

  describe("hasFurtherIncome", () => {
    it("should return true if the user has additional income", () => {
      expect(
        hasAndereArbeitsausgaben({
          context: { ...happyPathData, hasFurtherIncome: "yes" },
        }),
      ).toBe(true);
    });
  });
});
