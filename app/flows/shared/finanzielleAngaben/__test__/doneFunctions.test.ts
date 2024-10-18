import type {
  GeldanlagenArraySchema,
  GrundeigentumArraySchema,
  KinderArraySchema,
} from "~/flows/shared/finanzielleAngaben/context";
import {
  childDone,
  geldanlageDone,
  singleGrundeigentumDone,
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

const mockCompletedGrundeigentum: GrundeigentumArraySchema[0] = {
  art: "erbbaurecht",
  isBewohnt: "family",
  eigentuemer: "partner",
  flaeche: "100",
  verkaufswert: "100000",
  strassehausnummer: "Strasse 39",
  plz: "10629",
  ort: "Berlin",
  land: "Deutschland",
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

  describe("singleGrundeigentumDone", () => {
    it("should return false if the type is missing", () => {
      expect(
        singleGrundeigentumDone({
          ...mockCompletedGrundeigentum,
          art: undefined,
        }),
      ).toBe(false);
    });
    it("should return false if the eigentumer is missing", () => {
      expect(
        singleGrundeigentumDone({
          ...mockCompletedGrundeigentum,
          eigentuemer: undefined,
        }),
      ).toBe(false);
    });
    it("should return false if the area is missing", () => {
      expect(
        singleGrundeigentumDone({
          ...mockCompletedGrundeigentum,
          flaeche: undefined,
        }),
      ).toBe(false);
    });
    it("should return false if the worth is missing", () => {
      expect(
        singleGrundeigentumDone({
          ...mockCompletedGrundeigentum,
          verkaufswert: undefined,
        }),
      ).toBe(false);
    });
    it("should return false if the user doesn't personally live in the property and the location is missing", () => {
      expect(
        singleGrundeigentumDone({
          ...mockCompletedGrundeigentum,
          strassehausnummer: undefined,
        }),
      ).toBe(false);
      expect(
        singleGrundeigentumDone({
          ...mockCompletedGrundeigentum,
          plz: undefined,
        }),
      ).toBe(false);
      expect(
        singleGrundeigentumDone({
          ...mockCompletedGrundeigentum,
          ort: undefined,
        }),
      ).toBe(false);
      expect(
        singleGrundeigentumDone({
          ...mockCompletedGrundeigentum,
          land: undefined,
        }),
      ).toBe(false);
    });

    it("should return true if the user entered a completed singleGrundeigentum", () => {
      expect(singleGrundeigentumDone(mockCompletedGrundeigentum)).toBe(true);
    });
  });
});
