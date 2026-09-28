import { createSession, type Session } from "react-router";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../formular/klage-erstellen/userData";
import { updateSession } from "~/services/session.server";
import { deleteBeweisPersonReference } from "../deleteBeweisPersonReference";

vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("deleteBeweisPersonReference", () => {
  it("should not call updateSession if abschnitte is empty", () => {
    const userData = {
      abschnitte: [],
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession(userData);

    deleteBeweisPersonReference(mockSession, [1]);

    expect(updateSession).not.toHaveBeenCalled();
  });

  it("should not call updateSession if person of the array does not exist", () => {
    const userData = {
      abschnitte: [
        {
          beschreibung: "",
          personen: [
            {
              personAuswahl: "anotherPerson",
            },
          ],
        },
      ],
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession(userData);

    deleteBeweisPersonReference(mockSession, [0, 1]);

    expect(updateSession).not.toHaveBeenCalled();
  });

  it("should update the reuseBeweisePerson when the person is only a reference", () => {
    const abschnitte = [
      {
        beschreibung: "",
        personen: [
          {
            personAuswahl: "anotherPerson",
          },
          {
            personAuswahl: "anotherPerson",
          },
          {
            personAuswahl: "anotherPerson",
          },
        ],
      },
      {
        beschreibung: "",
        personen: [
          {
            personAuswahl: "anotherPerson",
            personReference: "0-0",
          },
          {
            personAuswahl: "anotherPerson",
            personReference: "0-1",
          },
        ],
        reuseBeweisePerson: {
          "0-0": "on",
          "0-1": "on",
          "0-2": "off",
        },
      },
    ];

    const userData = {
      abschnitte,
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession(userData);

    deleteBeweisPersonReference(mockSession, [1, 0]);

    const expectedAbschnitte: any[] = [...abschnitte];
    expectedAbschnitte[1] = {
      beschreibung: "",
      personen: [
        {
          personAuswahl: "anotherPerson",
          personReference: "0-0",
        },
        {
          personAuswahl: "anotherPerson",
          personReference: "0-1",
        },
      ],
      reuseBeweisePerson: {
        "0-0": "off",
        "0-1": "on",
        "0-2": "off",
      },
    };

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({ abschnitte: expectedAbschnitte }),
      expect.any(Function),
    );
  });

  it("should delete all reuseBeweisePerson when it does not have more references", () => {
    const abschnitte = [
      {
        beschreibung: "",
        personen: [
          {
            personAuswahl: "anotherPerson",
          },
          {
            personAuswahl: "anotherPerson",
          },
          {
            personAuswahl: "anotherPerson",
          },
        ],
      },
      {
        beschreibung: "",
        personen: [
          {
            personAuswahl: "anotherPerson",
            personReference: "0-0",
          },
        ],
        reuseBeweisePerson: {
          "0-0": "on",
          "0-1": "off",
          "0-2": "off",
        },
      },
    ];

    const userData = {
      abschnitte,
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession(userData);

    deleteBeweisPersonReference(mockSession, [1, 0]);

    const expectedAbschnitte: any[] = [...abschnitte];
    expectedAbschnitte[1] = {
      beschreibung: "",
      personen: [
        {
          personAuswahl: "anotherPerson",
          personReference: "0-0",
        },
      ],
    };

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({ abschnitte: expectedAbschnitte }),
      expect.any(Function),
    );
  });

  it("should delete the reuseBeweisePerson from child when deleting the main reference", () => {
    const abschnitte = [
      {
        beschreibung: "",
        personen: [
          {
            personAuswahl: "anotherPerson",
          },
        ],
      },
      {
        beschreibung: "",
        personen: [
          {
            personAuswahl: "anotherPerson",
            personReference: "0-0",
          },
        ],
        reuseBeweisePerson: {
          "0-0": "on",
        },
      },
    ];

    const userData = {
      abschnitte,
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession(userData);

    deleteBeweisPersonReference(mockSession, [0, 0]);

    const expectedAbschnitte: any[] = [...abschnitte];
    expectedAbschnitte[1] = {
      beschreibung: "",
      personen: [
        {
          personAuswahl: "anotherPerson",
        },
      ],
    };

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({ abschnitte: expectedAbschnitte }),
      expect.any(Function),
    );
  });
});
