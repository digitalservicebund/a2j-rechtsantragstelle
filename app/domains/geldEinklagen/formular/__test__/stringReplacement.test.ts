import type { Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";
import { getResponsibleCourt } from "../../services/court/getResponsibleCourt";
import {
  hasClaimVertrag,
  hasExclusivePlaceJurisdictionOrSelectCourt,
  hasAnwaltskosten,
  isBeklagtePerson,
  isCourtAGSchoeneberg,
  getCourtCost,
  hasStreitbeilegungGruende,
  hasAnwaltschaft,
  getAbschnitteWithInvalidAnotherPerson,
  hasMoreThanOneReusePersonen,
  hasMoreThanOneReuseDokumenten,
  isDocumentBeingReused,
  isPersonBeingReused,
} from "../stringReplacements";
import { type GeldEinklagenFormularUserData } from "../userData";

vi.mock("../../services/court/getResponsibleCourt");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("stringReplacement", () => {
  describe("isBeklagtePerson", () => {
    it("should return true in case gegenWenBeklagen is person", () => {
      const context = {
        gegenWenBeklagen: "person" as const,
      };

      const actual = isBeklagtePerson(context);
      expect(actual.isBeklagtePerson).toBe(true);
    });

    it("should return false in case gegenWenBeklagen is organisation", () => {
      const context = {
        gegenWenBeklagen: "organisation" as const,
      };

      const actual = isBeklagtePerson(context);
      expect(actual.isBeklagtePerson).toBe(false);
    });

    it("should return false in case gegenWenBeklagen is undefined", () => {
      const context = {
        gegenWenBeklagen: undefined,
      };

      const actual = isBeklagtePerson(context);
      expect(actual.isBeklagtePerson).toBe(false);
    });
  });

  describe("hasClaimVertrag", () => {
    it("should return hasClaimVertrag as true in case is versicherungVertrag yes", () => {
      const context: GeldEinklagenFormularUserData = {
        versicherungVertrag: "yes",
        klagendeVertrag: "no",
        mietePachtVertrag: "no",
      };

      const actual = hasClaimVertrag(context);
      expect(actual.hasClaimVertrag).toBe(true);
    });

    it("should return hasClaimVertrag as true in case is klagendeVertrag yes", () => {
      const context: GeldEinklagenFormularUserData = {
        versicherungVertrag: "no",
        klagendeVertrag: "yes",
        mietePachtVertrag: "no",
      };

      const actual = hasClaimVertrag(context);
      expect(actual.hasClaimVertrag).toBe(true);
    });

    it("should return hasClaimVertrag as true in case is mietePachtVertrag yes", () => {
      const context: GeldEinklagenFormularUserData = {
        versicherungVertrag: "no",
        klagendeVertrag: "no",
        mietePachtVertrag: "yes",
      };

      const actual = hasClaimVertrag(context);
      expect(actual.hasClaimVertrag).toBe(true);
    });

    it("should return hasClaimVertrag as false in case is mietePachtVertrag, versicherungVertrag and klagendeVertrag are no", () => {
      const context: GeldEinklagenFormularUserData = {
        mietePachtVertrag: "no",
        versicherungVertrag: "no",
        klagendeVertrag: "no",
      };

      const actual = hasClaimVertrag(context);
      expect(actual.hasClaimVertrag).toBe(false);
    });
  });

  describe("hasExclusivePlaceJurisdictionOrSelectCourt", () => {
    it("should return true if sachgebiet is miete and mietePachtRaum and mietePachtVertrag are yes", () => {
      const context: GeldEinklagenFormularUserData = {
        sachgebiet: "miete",
        mietePachtRaum: "yes",
        mietePachtVertrag: "yes",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(true);
    });

    it("should return false if sachgebiet is versicherung", () => {
      const context: GeldEinklagenFormularUserData = {
        sachgebiet: "versicherung",
        mietePachtRaum: "yes",
        mietePachtVertrag: "yes",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(false);
    });

    it("should return false if mietePachtRaum is no", () => {
      const context: GeldEinklagenFormularUserData = {
        sachgebiet: "miete",
        mietePachtRaum: "no",
        mietePachtVertrag: "yes",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(false);
    });

    it("should return false if mietePachtVertrag is not yes", () => {
      const context: GeldEinklagenFormularUserData = {
        sachgebiet: "miete",
        mietePachtRaum: "yes",
        mietePachtVertrag: "no",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(false);
    });

    it("should return true if gerichtsstandsvereinbarung yes", () => {
      const context: GeldEinklagenFormularUserData = {
        gerichtsstandsvereinbarung: "yes",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(true);
    });

    it("should return true if sachgebiet is urheberrecht and beklagtePersonGeldVerdienen is no", () => {
      const context: GeldEinklagenFormularUserData = {
        sachgebiet: "urheberrecht",
        beklagtePersonGeldVerdienen: "no",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(true);
    });

    it("should return false if sachgebiet is urheberrecht and beklagtePersonGeldVerdienen is yes", () => {
      const context: GeldEinklagenFormularUserData = {
        sachgebiet: "urheberrecht",
        beklagtePersonGeldVerdienen: "yes",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(false);
    });

    it("should return true pilotGerichtAuswahl is not undefined", () => {
      const context: GeldEinklagenFormularUserData = {
        pilotGerichtAuswahl: "beklagteCourt",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(true);
    });
  });

  describe("isCourtAGSchoeneberg", () => {
    it("should return true if court AG Schoeneberg", () => {
      const courtData: Jmtd14VTErwerberGerbeh = {
        LKZ: "11",
        OLG: "1",
        LG: "01",
        AG: "07",
        TYP_INFO: "Zivilgericht - Amtsgericht",
        BEZEICHNUNG: "Amtsgericht Schöneberg",
        ORT: "",
        ORTK: "",
        PLZ_ZUSTELLBEZIRK: "10823",
        STR_HNR: "",
        XML_SUPPORT: "JA" as const,
      };

      vi.mocked(getResponsibleCourt).mockReturnValueOnce(courtData);

      const actual = isCourtAGSchoeneberg({});
      expect(actual.isCourtAGSchoeneberg).toBe(true);
    });

    it("should return false if court is not AG Schoeneberg", () => {
      const courtData: Jmtd14VTErwerberGerbeh = {
        LKZ: "11",
        OLG: "1",
        LG: "01",
        AG: "07",
        TYP_INFO: "Zivilgericht - Amtsgericht",
        BEZEICHNUNG: "Amtsgericht Lichtenberg",
        ORT: "",
        ORTK: "",
        PLZ_ZUSTELLBEZIRK: "10365",
        STR_HNR: "",
        XML_SUPPORT: "JA" as const,
      };

      vi.mocked(getResponsibleCourt).mockReturnValueOnce(courtData);

      const actual = isCourtAGSchoeneberg({});
      expect(actual.isCourtAGSchoeneberg).toBe(false);
    });
  });

  describe("getCourtCost", () => {
    it.each([
      ["80,00", "99,00"],
      ["122,00", "500,01"],
      ["122,00", "1.000,00"],
      ["164,00", "1.234,56"],
      ["521,00", "9.000,00"],
      ["566,00", "9.999,99"],
    ])(
      "should return %s court cost for claim amount %s",
      (courtCost, forderungGesamtbetrag) => {
        const actual = getCourtCost({ forderungGesamtbetrag });

        expect(actual).toEqual({ courtCost });
      },
    );
  });

  describe("hasAnwaltskosten", () => {
    it("should return false if anwaltskosten is empty string", () => {
      const actual = hasAnwaltskosten({ anwaltskosten: "" });

      expect(actual.hasAnwaltskosten).toBe(false);
    });

    it("should return false if anwaltskosten is 0,00", () => {
      const actual = hasAnwaltskosten({ anwaltskosten: "0,00" });

      expect(actual.hasAnwaltskosten).toBe(false);
    });

    it("should return true if anwaltskosten is greater than 0", () => {
      const actual = hasAnwaltskosten({ anwaltskosten: "12,34" });

      expect(actual.hasAnwaltskosten).toBe(true);
    });
  });

  describe("hasStreitbeilegungGruende", () => {
    it("should return true if streitbeilegungGruende is yes", () => {
      const actual = hasStreitbeilegungGruende({
        streitbeilegungGruende: "yes",
      });

      expect(actual.hasStreitbeilegungGruende).toBe(true);
    });

    it("should return false if streitbeilegungGruende is no", () => {
      const actual = hasStreitbeilegungGruende({
        streitbeilegungGruende: "no",
      });

      expect(actual.hasStreitbeilegungGruende).toBe(false);
    });

    it("should return false if streitbeilegungGruende is noSpecification", () => {
      const actual = hasStreitbeilegungGruende({
        streitbeilegungGruende: "noSpecification",
      });

      expect(actual.hasStreitbeilegungGruende).toBe(false);
    });

    it("should return false if streitbeilegungGruende is undefined", () => {
      const actual = hasStreitbeilegungGruende({
        streitbeilegungGruende: undefined,
      });

      expect(actual.hasStreitbeilegungGruende).toBe(false);
    });
  });

  describe("hasAnwaltschaft", () => {
    it("should return true if anwaltschaft is yes", () => {
      const actual = hasAnwaltschaft({ anwaltschaft: "yes" });

      expect(actual.hasAnwaltschaft).toBe(true);
    });

    it("should return false if anwaltschaft is no", () => {
      const actual = hasAnwaltschaft({ anwaltschaft: "no" });

      expect(actual.hasAnwaltschaft).toBe(false);
    });

    it("should return false if anwaltschaft is undefined", () => {
      const actual = hasAnwaltschaft({ anwaltschaft: undefined });

      expect(actual.hasAnwaltschaft).toBe(false);
    });
  });

  describe("getAbschnitteWithInvalidAnotherPerson", () => {
    it("should return undefined if abschnitte is undefined", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: undefined,
      };

      const actual = getAbschnitteWithInvalidAnotherPerson(context);

      expect(actual.abschnitteWithInvalidAnotherPerson).toBeUndefined();
    });

    it("should return the abschnitte indexes with invalid anotherPerson", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "Abschnitt 1",
            personen: [
              // @ts-ignore
              {
                personAuswahl: "anotherPerson",
                vorname: "",
                nachname: "",
              },
            ],
          },
          {
            beschreibung: "Abschnitt 2",
            personen: [
              {
                personAuswahl: "anotherPerson",
                anrede: "herr",
                title: "",
                vorname: "Max",
                nachname: "Mustermann",
                strasse: "strasse",
                hausnummer: "hausnummer",
                plz: "plz",
                ort: "ort",
                land: "land",
                email: "email",
                telefonnummer: "telefonnummer",
                personId: "123",
              },
            ],
          },
          {
            beschreibung: "Abschnitt 3",
            personen: [
              {
                personAuswahl: "beklagte",
                personId: "123",
              },
            ],
          },
          {
            beschreibung: "Abschnitt 4",
            personen: [
              // @ts-ignore
              {
                personAuswahl: "anotherPerson",
              },
            ],
          },
        ],
      };

      const actual = getAbschnitteWithInvalidAnotherPerson(context);

      expect(actual.abschnitteWithInvalidAnotherPerson).toBe("1, 4");
    });
  });

  describe("hasMoreThanOneReusePersonen", () => {
    it("should return false in case abschnitt is empty", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [],
        pageData: {
          arrayIndexes: [0],
        },
      };
      const actual = hasMoreThanOneReusePersonen(context);

      expect(actual.hasMoreThanOneReusePersonen).toBe(false);
    });

    it("should return false in case arrayIndexes is empty", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
          },
        ],
        pageData: {
          arrayIndexes: [],
        },
      };
      const actual = hasMoreThanOneReusePersonen(context);

      expect(actual.hasMoreThanOneReusePersonen).toBe(false);
    });

    it("should return true in case exist more than one reuseable person", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
            personen: [
              {
                personAuswahl: "anotherPerson",
                anrede: "herr",
                title: "",
                vorname: "Max",
                nachname: "Mustermann",
                strasse: "strasse",
                hausnummer: "hausnummer",
                plz: "plz",
                ort: "ort",
                land: "land",
                email: "email",
                telefonnummer: "telefonnummer",
                personId: "123",
              },
              {
                personAuswahl: "anotherPerson",
                anrede: "herr",
                title: "",
                vorname: "Max",
                nachname: "Mustermann",
                strasse: "strasse",
                hausnummer: "hausnummer",
                plz: "plz",
                ort: "ort",
                land: "land",
                email: "email",
                telefonnummer: "telefonnummer",
                personId: "123",
              },
            ],
          },
          { beschreibung: "2" },
        ],
        pageData: {
          arrayIndexes: [1],
        },
      };
      const actual = hasMoreThanOneReusePersonen(context);

      expect(actual.hasMoreThanOneReusePersonen).toBe(true);
    });

    it("should return false in case exist one reuseable person", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
            personen: [
              {
                personAuswahl: "anotherPerson",
                anrede: "herr",
                title: "",
                vorname: "Max",
                nachname: "Mustermann",
                strasse: "strasse",
                hausnummer: "hausnummer",
                plz: "plz",
                ort: "ort",
                land: "land",
                email: "email",
                telefonnummer: "telefonnummer",
                personId: "123",
              },
            ],
          },
          { beschreibung: "2" },
        ],
        pageData: {
          arrayIndexes: [1],
        },
      };
      const actual = hasMoreThanOneReusePersonen(context);

      expect(actual.hasMoreThanOneReusePersonen).toBe(false);
    });
  });

  describe("hasMoreThanOneReuseDokumenten", () => {
    it("should return false in case abschnitt is empty", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [],
        pageData: {
          arrayIndexes: [0],
        },
      };
      const actual = hasMoreThanOneReuseDokumenten(context);

      expect(actual.hasMoreThanOneReuseDokumenten).toBe(false);
    });

    it("should return false in case arrayIndexes is empty", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
          },
        ],
        pageData: {
          arrayIndexes: [],
        },
      };
      const actual = hasMoreThanOneReuseDokumenten(context);

      expect(actual.hasMoreThanOneReuseDokumenten).toBe(false);
    });

    it("should return true in case exist more than one reuseable document", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
            dokumenten: [
              {
                beschreibung: "1",
              },
              {
                beschreibung: "2",
              },
            ],
          },
          { beschreibung: "2" },
        ],
        pageData: {
          arrayIndexes: [1],
        },
      };
      const actual = hasMoreThanOneReuseDokumenten(context);

      expect(actual.hasMoreThanOneReuseDokumenten).toBe(true);
    });

    it("should return false in case exist one reuseable document", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
            dokumenten: [
              {
                beschreibung: "1",
              },
            ],
          },
          { beschreibung: "2" },
        ],
        pageData: {
          arrayIndexes: [1],
        },
      };
      const actual = hasMoreThanOneReuseDokumenten(context);

      expect(actual.hasMoreThanOneReuseDokumenten).toBe(false);
    });
  });

  describe("isDocumentBeingReused", () => {
    it("should return false in case abschnitt is empty", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [],
        pageData: {
          arrayIndexes: [0],
        },
      };
      const actual = isDocumentBeingReused(context);

      expect(actual.isDocumentBeingReused).toBe(false);
    });

    it("should return false in case arrayIndexes is empty", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
          },
        ],
        pageData: {
          arrayIndexes: [],
        },
      };
      const actual = isDocumentBeingReused(context);

      expect(actual.isDocumentBeingReused).toBe(false);
    });

    it("should return false in case document does not exist", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
            dokumenten: [
              {
                beschreibung: "1",
              },
            ],
          },
        ],
        pageData: {
          arrayIndexes: [0, 1],
        },
      };
      const actual = isDocumentBeingReused(context);

      expect(actual.isDocumentBeingReused).toBe(false);
    });

    it("should return true in case document has reference", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
            dokumenten: [
              {
                beschreibung: "1",
                dokumentReference: "111",
              },
            ],
          },
        ],
        pageData: {
          arrayIndexes: [0, 0],
        },
      };
      const actual = isDocumentBeingReused(context);

      expect(actual.isDocumentBeingReused).toBe(true);
    });

    it("should return true in case document has other references", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
            dokumenten: [
              {
                beschreibung: "1",
              },
            ],
          },
          {
            beschreibung: "",
            dokumenten: [
              {
                beschreibung: "1",
                dokumentReference: "0-0",
              },
            ],
            reuseBeweiseDokument: {
              "0-0": "on",
            },
          },
        ],
        pageData: {
          arrayIndexes: [0, 0],
        },
      };
      const actual = isDocumentBeingReused(context);

      expect(actual.isDocumentBeingReused).toBe(true);
    });

    it("should return false in case document does not have reference or is not referenced", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
            dokumenten: [
              {
                beschreibung: "1",
              },
              {
                beschreibung: "2",
              },
            ],
          },
          {
            beschreibung: "",
            dokumenten: [
              {
                beschreibung: "1",
                dokumentReference: "0-0",
              },
            ],
            reuseBeweiseDokument: {
              "0-0": "on",
              "0-1": "off",
            },
          },
        ],
        pageData: {
          arrayIndexes: [0, 1],
        },
      };
      const actual = isDocumentBeingReused(context);

      expect(actual.isDocumentBeingReused).toBe(false);
    });
  });

  describe("isPersonBeingReused", () => {
    it("should return false in case abschnitt is empty", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [],
        pageData: {
          arrayIndexes: [0],
        },
      };
      const actual = isPersonBeingReused(context);

      expect(actual.isPersonBeingReused).toBe(false);
    });

    it("should return false in case arrayIndexes is empty", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
          },
        ],
        pageData: {
          arrayIndexes: [],
        },
      };
      const actual = isPersonBeingReused(context);

      expect(actual.isPersonBeingReused).toBe(false);
    });

    it("should return false in case person does not exist", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
            personen: [
              {
                personAuswahl: "anotherPerson",
                anrede: "herr",
                title: "",
                vorname: "Max",
                nachname: "Mustermann",
                strasse: "strasse",
                hausnummer: "hausnummer",
                plz: "plz",
                ort: "ort",
                land: "land",
                email: "email",
                telefonnummer: "telefonnummer",
                personId: "123",
              },
            ],
          },
        ],
        pageData: {
          arrayIndexes: [0, 1],
        },
      };
      const actual = isPersonBeingReused(context);

      expect(actual.isPersonBeingReused).toBe(false);
    });

    it("should return true in case person has reference", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
            personen: [
              {
                personAuswahl: "anotherPerson",
                anrede: "herr",
                title: "",
                vorname: "Max",
                nachname: "Mustermann",
                strasse: "strasse",
                hausnummer: "hausnummer",
                plz: "plz",
                ort: "ort",
                land: "land",
                email: "email",
                telefonnummer: "telefonnummer",
                personId: "123",
                personReference: "0-1",
              },
            ],
          },
        ],
        pageData: {
          arrayIndexes: [0, 0],
        },
      };
      const actual = isPersonBeingReused(context);

      expect(actual.isPersonBeingReused).toBe(true);
    });

    it("should return true in case document has other references", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
            personen: [
              {
                personAuswahl: "anotherPerson",
                anrede: "herr",
                title: "",
                vorname: "Max",
                nachname: "Mustermann",
                strasse: "strasse",
                hausnummer: "hausnummer",
                plz: "plz",
                ort: "ort",
                land: "land",
                email: "email",
                telefonnummer: "telefonnummer",
                personId: "123",
              },
            ],
          },
          {
            beschreibung: "",
            personen: [
              {
                personAuswahl: "anotherPerson",
                anrede: "herr",
                title: "",
                vorname: "Max",
                nachname: "Mustermann",
                strasse: "strasse",
                hausnummer: "hausnummer",
                plz: "plz",
                ort: "ort",
                land: "land",
                email: "email",
                telefonnummer: "telefonnummer",
                personId: "123",
                personReference: "0-0",
              },
            ],
            reuseBeweisePerson: {
              "0-0": "on",
            },
          },
        ],
        pageData: {
          arrayIndexes: [0, 0],
        },
      };
      const actual = isPersonBeingReused(context);

      expect(actual.isPersonBeingReused).toBe(true);
    });

    it("should return false in case document does not have reference or is not referenced", () => {
      const context: GeldEinklagenFormularUserData = {
        abschnitte: [
          {
            beschreibung: "1",
            personen: [
              {
                personAuswahl: "anotherPerson",
                anrede: "herr",
                title: "",
                vorname: "Max",
                nachname: "Mustermann",
                strasse: "strasse",
                hausnummer: "hausnummer",
                plz: "plz",
                ort: "ort",
                land: "land",
                email: "email",
                telefonnummer: "telefonnummer",
                personId: "123",
              },
              {
                personAuswahl: "anotherPerson",
                anrede: "herr",
                title: "",
                vorname: "Max",
                nachname: "Mustermann",
                strasse: "strasse",
                hausnummer: "hausnummer",
                plz: "plz",
                ort: "ort",
                land: "land",
                email: "email",
                telefonnummer: "telefonnummer",
                personId: "123",
              },
            ],
          },
          {
            beschreibung: "",
            personen: [
              {
                personAuswahl: "anotherPerson",
                anrede: "herr",
                title: "",
                vorname: "Max",
                nachname: "Mustermann",
                strasse: "strasse",
                hausnummer: "hausnummer",
                plz: "plz",
                ort: "ort",
                land: "land",
                email: "email",
                telefonnummer: "telefonnummer",
                personId: "123",
                personReference: "0-0",
              },
            ],
            reuseBeweisePerson: {
              "0-0": "on",
              "0-1": "off",
            },
          },
        ],
        pageData: {
          arrayIndexes: [0, 1],
        },
      };
      const actual = isPersonBeingReused(context);

      expect(actual.isPersonBeingReused).toBe(false);
    });
  });
});
