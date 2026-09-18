import { createSession } from "react-router";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../formular/klage-erstellen/userData";
import { copyOrRemoveReferencePersons } from "../copyOrRemoveReferencePersons";
import { type Session } from "react-router";
import { updateSession } from "~/services/session.server";

vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const mockRequestUrl =
  "http://localhost:3000/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/2/beweis-person-wiederverwenden";

describe("copyOrRemoveReferencePersons", () => {
  it("should not call updateSession if abschnitte is empty", async () => {
    const userData = {
      abschnitte: [],
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession();
    const request = new Request(mockRequestUrl);

    await copyOrRemoveReferencePersons(request, userData, mockSession);

    expect(updateSession).not.toHaveBeenCalled();
  });

  it("should not call updateSession if does not contains arrayIndex on the url", async () => {
    const userData = {
      abschnitte: [],
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession();
    const request = new Request(
      "http://localhost:3000/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/beweis-person-wiederverwenden",
    );

    await copyOrRemoveReferencePersons(request, userData, mockSession);

    expect(updateSession).not.toHaveBeenCalled();
  });

  it("should copy a person reference from another abschnitt", async () => {
    const abschnitte = [
      {
        beschreibung: "beschreibung 1",
        personen: [
          {
            personAuswahl: "anotherPerson",
            anrede: "herr",
            title: "title 1",
            vorname: "vorname 1",
            nachname: "nachname 1",
            strasse: "strasse 1",
            hausnummer: "hausnummer 1",
            plz: "plz 1",
            ort: "ort 1",
            land: "land 1",
            telefonnummer: "telefonnummer 1",
            email: "email 1",
          },
          {
            personAuswahl: "anotherPerson",
            anrede: "herr",
            title: "title 2",
            vorname: "vorname 2",
            nachname: "nachname 2",
            strasse: "strasse 2",
            hausnummer: "hausnummer 2",
            plz: "plz 2",
            ort: "ort 2",
            land: "land 2",
            telefonnummer: "telefonnummer 2",
            email: "email 2",
          },
        ],
      },
      {
        beschreibung: "beschreibung 2",
        personen: [
          {
            personAuswahl: "anotherPerson",
            anrede: "herr",
            title: "title 3",
            vorname: "vorname 3",
            nachname: "nachname 3",
            strasse: "strasse 3",
            hausnummer: "hausnummer 3",
            plz: "plz 3",
            ort: "ort 3",
            land: "land 3",
            telefonnummer: "telefonnummer 3",
            email: "email 3",
          },
        ],
      },
      {
        beschreibung: "beschreibung 3",
        reuseBeweisePerson: {
          "0-0": "on",
          "0-1": "off",
          "1-0": "on",
        },
      },
    ];

    const userData = {
      pageData: { arrayIndexes: [2] },
      abschnitte,
    } as unknown as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession();
    const request = new Request(mockRequestUrl);

    await copyOrRemoveReferencePersons(request, userData, mockSession);

    const expectedAbschnitte: any[] = [...abschnitte];
    expectedAbschnitte[2] = {
      beschreibung: "beschreibung 3",
      personen: [
        {
          personAuswahl: "anotherPerson",
          anrede: "herr",
          title: "title 1",
          vorname: "vorname 1",
          nachname: "nachname 1",
          strasse: "strasse 1",
          hausnummer: "hausnummer 1",
          plz: "plz 1",
          ort: "ort 1",
          land: "land 1",
          telefonnummer: "telefonnummer 1",
          email: "email 1",
          personReference: "0-0",
        },
        {
          personAuswahl: "anotherPerson",
          anrede: "herr",
          title: "title 3",
          vorname: "vorname 3",
          nachname: "nachname 3",
          strasse: "strasse 3",
          hausnummer: "hausnummer 3",
          plz: "plz 3",
          ort: "ort 3",
          land: "land 3",
          telefonnummer: "telefonnummer 3",
          email: "email 3",
          personReference: "1-0",
        },
      ],
      reuseBeweisePerson: {
        "0-0": "on",
        "0-1": "off",
        "1-0": "on",
      },
    };

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({ abschnitte: expectedAbschnitte }),
      expect.any(Function),
    );
  });

  it("should remove an existing person reference from another abschnitt", async () => {
    const abschnitte = [
      {
        beschreibung: "beschreibung 1",
        personen: [
          {
            personAuswahl: "anotherPerson",
            anrede: "herr",
            title: "title 1",
            vorname: "vorname 1",
            nachname: "nachname 1",
            strasse: "strasse 1",
            hausnummer: "hausnummer 1",
            plz: "plz 1",
            ort: "ort 1",
            land: "land 1",
            telefonnummer: "telefonnummer 1",
            email: "email 1",
          },
          {
            personAuswahl: "anotherPerson",
            anrede: "herr",
            title: "title 2",
            vorname: "vorname 2",
            nachname: "nachname 2",
            strasse: "strasse 2",
            hausnummer: "hausnummer 2",
            plz: "plz 2",
            ort: "ort 2",
            land: "land 2",
            telefonnummer: "telefonnummer 2",
            email: "email 2",
          },
        ],
      },
      {
        beschreibung: "beschreibung 2",
        personen: [
          {
            personAuswahl: "anotherPerson",
            anrede: "herr",
            title: "title 1",
            vorname: "vorname 1",
            nachname: "nachname 1",
            strasse: "strasse 1",
            hausnummer: "hausnummer 1",
            plz: "plz 1",
            ort: "ort 1",
            land: "land 1",
            telefonnummer: "telefonnummer 1",
            email: "email 1",
            personReference: "0-0",
          },
          {
            personAuswahl: "anotherPerson",
            anrede: "herr",
            title: "title 2",
            vorname: "vorname 2",
            nachname: "nachname 2",
            strasse: "strasse 2",
            hausnummer: "hausnummer 2",
            plz: "plz 2",
            ort: "ort 2",
            land: "land 2",
            telefonnummer: "telefonnummer 2",
            email: "email 2",
            personReference: "0-1",
          },
        ],
        reuseBeweisePerson: {
          "0-0": "off",
          "0-1": "off",
        },
      },
    ];

    const userData = {
      pageData: { arrayIndexes: [1] },
      abschnitte,
    } as unknown as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession();
    const request = new Request(
      "http://localhost:3000/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/1/beweis-person-wiederverwenden",
    );

    await copyOrRemoveReferencePersons(request, userData, mockSession);

    const expectedAbschnitte: any[] = [...abschnitte];
    expectedAbschnitte[1] = {
      beschreibung: "beschreibung 2",
      personen: [],
      reuseBeweisePerson: {
        "0-0": "off",
        "0-1": "off",
      },
    };

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({ abschnitte: expectedAbschnitte }),
      expect.any(Function),
    );
  });
});
