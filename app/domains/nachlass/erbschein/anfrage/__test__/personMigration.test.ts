import {
  type BaseElternteilKind,
  type BaseKind,
} from "../../shared/erbfolgeTypes";
import { emptyDate, migrateElternteil, migrateKind } from "../personMigration";

describe("Person migration", () => {
  describe("migrateKind", () => {
    it("should migrate a living kind", () => {
      const kind: BaseKind = {
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "yes",
      };

      const migratedKind = migrateKind(kind);

      expect(migratedKind).toEqual({
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "yes",
        parentKindIndex: kind.parentKindIndex,
        geburtsdatum: emptyDate,
        geburtsort: "",
        strasse: "",
        hausnummer: "",
        plz: "",
        ort: "",
        land: "",
      });
    });

    it("should migrate a deceased kind without children", () => {
      const kind: BaseKind = {
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "no",
        hatteKinder: "no",
      };

      const migratedKind = migrateKind(kind);

      expect(migratedKind).toEqual({
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "no",
        parentKindIndex: kind.parentKindIndex,

        geburtsdatum: emptyDate,
        geburtsort: "",
        sterbedatum: emptyDate,
        sterbeort: "",
        hatteKinder: "no",
      });
    });

    it("should migrate a deceased kind with children", () => {
      const kind: BaseKind = {
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [
          {
            vorname: "Anna",
            nachname: "Mustermann",
            isAlive: "yes",
          },
        ],
      };

      const migratedKind = migrateKind(kind);

      expect(migratedKind).toEqual({
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "no",
        geburtsdatum: emptyDate,
        geburtsort: "",
        sterbedatum: emptyDate,
        sterbeort: "",
        hatteKinder: "yes",
        kinder: [
          {
            vorname: "Anna",
            nachname: "Mustermann",
            isAlive: "yes",
            geburtsdatum: emptyDate,
            geburtsort: "",
            strasse: "",
            hausnummer: "",
            plz: "",
            ort: "",
            land: "",
          },
        ],
      });
    });

    it("should migrate nested children", () => {
      const kind: BaseKind = {
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [
          {
            vorname: "Anna",
            nachname: "Mustermann",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              {
                vorname: "Lukas",
                nachname: "Mustermann",
                isAlive: "yes",
              },
            ],
          },
        ],
      };

      const migratedKind = migrateKind(kind);

      expect(migratedKind).toEqual({
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "no",
        geburtsdatum: emptyDate,
        geburtsort: "",
        sterbedatum: emptyDate,
        sterbeort: "",
        hatteKinder: "yes",
        kinder: [
          {
            vorname: "Anna",
            nachname: "Mustermann",
            isAlive: "no",
            geburtsdatum: emptyDate,
            geburtsort: "",
            sterbedatum: emptyDate,
            sterbeort: "",
            hatteKinder: "yes",
            kinder: [
              {
                vorname: "Lukas",
                nachname: "Mustermann",
                isAlive: "yes",
                geburtsdatum: emptyDate,
                geburtsort: "",
                strasse: "",
                hausnummer: "",
                plz: "",
                ort: "",
                land: "",
              },
            ],
          },
        ],
      });
    });

    it("should preserve parent indexes for children", () => {
      const kind: BaseKind = {
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "no",
        hatteKinder: "yes",
        parentKindIndex: "0",
        kinder: [
          {
            vorname: "Anna",
            nachname: "Mustermann",
            isAlive: "no",
            hatteKinder: "yes",
            parentKindIndex: "0",
            kinder: [
              {
                vorname: "Lukas",
                nachname: "Mustermann",
                isAlive: "yes",
                parentKindIndex: "0",
              },
            ],
          },
        ],
      };

      const migratedKind = migrateKind(kind);

      expect(migratedKind).toMatchObject({
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [
          {
            parentKindIndex: "0",
          },
        ],
      });
    });
  });
  describe("migrateElternteilKind", () => {
    it("should migrate a living elternteil kind", () => {
      const kind: BaseElternteilKind = {
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "yes",
        parentElternteilIndex: "0",
        parentKindIndex: "0",
      };

      const migratedKind = migrateElternteil(kind);

      expect(migratedKind).toEqual({
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "yes",
        parentKindIndex: "0",
        geburtsdatum: emptyDate,
        geburtsort: "",
        strasse: "",
        hausnummer: "",
        plz: "",
        ort: "",
        land: "",
      });
    });

    it("should migrate a deceased elternteil kind without children", () => {
      const kind: BaseElternteilKind = {
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "no",
        hatteKinder: "no",
      };

      const migratedKind = migrateElternteil(kind);

      expect(migratedKind).toEqual({
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "no",
        geburtsdatum: emptyDate,
        geburtsort: "",
        sterbedatum: emptyDate,
        sterbeort: "",
        hatteKinder: "no",
      });
    });

    it("should migrate a deceased elternteil kind with children", () => {
      const kind: BaseElternteilKind = {
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [
          {
            vorname: "Anna",
            nachname: "Mustermann",
            isAlive: "yes",
          },
        ],
      };

      const migratedKind = migrateElternteil(kind);

      expect(migratedKind).toEqual({
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "no",
        parentKindIndex: kind.parentKindIndex,

        geburtsdatum: emptyDate,
        geburtsort: "",
        sterbedatum: emptyDate,
        sterbeort: "",
        hatteKinder: "yes",
        kinder: [
          {
            vorname: "Anna",
            nachname: "Mustermann",
            isAlive: "yes",
            geburtsdatum: emptyDate,
            geburtsort: "",
            strasse: "",
            hausnummer: "",
            plz: "",
            ort: "",
            land: "",
          },
        ],
      });
    });

    it("should preserve parent indexes for elternteil children", () => {
      const kind: BaseElternteilKind = {
        vorname: "Max",
        nachname: "Mustermann",
        isAlive: "no",
        hatteKinder: "yes",
        parentElternteilIndex: "0",
        parentKindIndex: "0",
        kinder: [
          {
            vorname: "Anna",
            nachname: "Mustermann",
            isAlive: "no",
            hatteKinder: "yes",
            parentElternteilIndex: "0",
            parentKindIndex: "0",
            kinder: [
              {
                vorname: "Lukas",
                nachname: "Mustermann",
                isAlive: "yes",
                parentElternteilIndex: "0",
                parentKindIndex: "0",
              },
            ],
          },
        ],
      };

      const migratedKind = migrateElternteil(kind);

      expect(migratedKind).toMatchObject({
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [
          {
            parentElternteilIndex: "0",
            parentKindIndex: "0",
          },
        ],
      });
    });
  });
});
