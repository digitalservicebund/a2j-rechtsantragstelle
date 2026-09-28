import { createSession, type Session } from "react-router";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../formular/klage-erstellen/userData";
import { updateSession } from "~/services/session.server";
import { deleteBeweisAbschnittReference } from "../deleteBeweisAbschnittReference";

vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("deleteBeweisAbschnittReference", () => {
  it("should not call updateSession if abschnitte is empty", () => {
    const userData = {
      abschnitte: [],
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession(userData);

    deleteBeweisAbschnittReference(mockSession, 0);

    expect(updateSession).not.toHaveBeenCalled();
  });

  it("should not call updateSession if abschnitte does not exist", () => {
    const userData = {
      abschnitte: [
        {
          beschreibung: "",
        },
      ],
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession(userData);

    deleteBeweisAbschnittReference(mockSession, 1);

    expect(updateSession).not.toHaveBeenCalled();
  });

  it("should delete the reuseBeweiseDokument from child when deleting the main reference", () => {
    const abschnitte = [
      {
        beschreibung: "",
        dokumenten: [
          {
            beschreibung: "dokument 1",
          },
        ],
      },
      {
        beschreibung: "",
        dokumenten: [
          {
            beschreibung: "dokument 1",
            dokumentReference: "0-0",
          },
        ],
        reuseBeweiseDokument: {
          "0-0": "on",
        },
      },
    ];

    const userData = {
      abschnitte,
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession(userData);

    deleteBeweisAbschnittReference(mockSession, 0);

    const expectedAbschnitte: any[] = [...abschnitte];
    expectedAbschnitte[1] = {
      beschreibung: "",
      dokumenten: [
        {
          beschreibung: "dokument 1",
        },
      ],
    };

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({ abschnitte: expectedAbschnitte }),
      expect.any(Function),
    );
  });

  it("should shift the dokument reference when deleting the main reference", () => {
    const abschnitte = [
      {
        beschreibung: "",
        dokumenten: [
          {
            beschreibung: "dokument 1",
            dokumentReference: "1-0",
          },
        ],
        reuseBeweiseDokument: {
          "1-0": "on",
        },
      },
      {
        beschreibung: "",
        dokumenten: [
          {
            beschreibung: "dokument 1",
          },
        ],
      },
      {
        beschreibung: "",
        dokumenten: [
          {
            beschreibung: "dokument 1",
            dokumentReference: "1-0",
          },
        ],
        reuseBeweiseDokument: {
          "1-0": "on",
        },
      },
    ];

    const userData = {
      abschnitte,
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession(userData);

    deleteBeweisAbschnittReference(mockSession, 1);

    const expectedAbschnitte: any[] = [...abschnitte];
    expectedAbschnitte[0] = {
      beschreibung: "",
      dokumenten: [
        {
          beschreibung: "dokument 1",
        },
      ],
    };

    expectedAbschnitte[2] = {
      beschreibung: "",
      dokumenten: [
        {
          beschreibung: "dokument 1",
          dokumentReference: "0-0",
        },
      ],
      reuseBeweiseDokument: {
        "0-0": "on",
      },
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

    deleteBeweisAbschnittReference(mockSession, 0);

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

  it("should shift the personen reference when deleting the main reference", () => {
    const abschnitte = [
      {
        beschreibung: "",
        personen: [
          {
            personAuswahl: "anotherPerson",
            personReference: "1-0",
          },
        ],
        reuseBeweisePerson: {
          "1-0": "on",
        },
      },
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
            personReference: "1-0",
          },
        ],
        reuseBeweisePerson: {
          "1-0": "on",
        },
      },
    ];

    const userData = {
      abschnitte,
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession(userData);

    deleteBeweisAbschnittReference(mockSession, 1);

    const expectedAbschnitte: any[] = [...abschnitte];
    expectedAbschnitte[0] = {
      beschreibung: "",
      personen: [
        {
          personAuswahl: "anotherPerson",
        },
      ],
    };

    expectedAbschnitte[2] = {
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
    };

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({ abschnitte: expectedAbschnitte }),
      expect.any(Function),
    );
  });
});
