import type {
  GeldanlagenArraySchema,
  KinderArraySchema,
} from "~/flows/shared/finanzielleAngaben/context";
import {
  childDone,
  geldanlageDone,
} from "~/flows/shared/finanzielleAngaben/doneFunctions";

const mockCompletedChild: KinderArraySchema[0] = {
  vorname: "Child",
  nachname: "Childson",
  geburtsdatum: "01.01.2020",
  wohnortBeiAntragsteller: "yes",
  eigeneEinnahmen: "yes",
  einnahmen: "100",
  unterhalt: "yes",
  unterhaltsSumme: "100",
};

const mockCompletedAnlage: GeldanlagenArraySchema[0] = {
  art: "bargeld",
  eigentuemer: "partner",
  wert: "100",
};

describe("shared finanielle angaben doneFunctions", () => {
  describe("childDone", () => {
    it("should return false if the name and birth date are missing", () => {
      expect(childDone({ ...mockCompletedChild, vorname: undefined })).toBe(
        false,
      );
      expect(childDone({ ...mockCompletedChild, nachname: undefined })).toBe(
        false,
      );
      expect(
        childDone({ ...mockCompletedChild, geburtsdatum: undefined }),
      ).toBe(false);
    });

    it("should return false if the child lives with the antragstellende Person and has income they haven't entered", () => {
      expect(
        childDone({
          ...mockCompletedChild,
          wohnortBeiAntragsteller: "yes",
          eigeneEinnahmen: "yes",
          einnahmen: undefined,
        }),
      ).toBe(false);
      expect(
        childDone({
          ...mockCompletedChild,
          wohnortBeiAntragsteller: "partially",
          eigeneEinnahmen: "yes",
          einnahmen: undefined,
        }),
      ).toBe(false);
    });

    it("should return false if the child does not live with the antragstellende Person and receives support they haven't entered", () => {
      expect(
        childDone({
          ...mockCompletedChild,
          wohnortBeiAntragsteller: "no",
          unterhalt: "yes",
          unterhaltsSumme: undefined,
        }),
      ).toBe(false);
    });

    it("should return true when the user has added all required child fields", () => {
      expect(childDone(mockCompletedChild)).toBe(true);
      expect(
        childDone({
          ...mockCompletedChild,
          wohnortBeiAntragsteller: "no",
          unterhalt: "no",
        }),
      ).toBe(true);
      expect(
        childDone({ ...mockCompletedChild, wohnortBeiAntragsteller: "no" }),
      ).toBe(true);
      expect(childDone({ ...mockCompletedChild, eigeneEinnahmen: "no" })).toBe(
        true,
      );
      expect(
        childDone({
          ...mockCompletedChild,
          wohnortBeiAntragsteller: "partially",
        }),
      ).toBe(true);
      expect(
        childDone({
          ...mockCompletedChild,
          wohnortBeiAntragsteller: "partially",
          eigeneEinnahmen: "no",
        }),
      ).toBe(true);
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
