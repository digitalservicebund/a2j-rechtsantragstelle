import { createSession, type Session } from "react-router";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../formular/klage-erstellen/userData";
import { deleteBeweisDokumentReference } from "../deleteBeweisDokumentReference";
import { updateSession } from "~/services/session.server";

vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("deleteBeweisDokumentReference", () => {
  it("should not call updateSession if abschnitte is empty", () => {
    const userData = {
      abschnitte: [],
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession(userData);

    deleteBeweisDokumentReference(mockSession, [1]);

    expect(updateSession).not.toHaveBeenCalled();
  });

  it("should not call updateSession if dokument of the array does not exist", () => {
    const userData = {
      abschnitte: [
        {
          beschreibung: "",
          dokumenten: [
            {
              beschreibung: "dokument",
            },
          ],
        },
      ],
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession(userData);

    deleteBeweisDokumentReference(mockSession, [0, 1]);

    expect(updateSession).not.toHaveBeenCalled();
  });

  it("should update the reuseBeweiseDokument when the documents is only a reference", () => {
    const abschnitte = [
      {
        beschreibung: "",
        dokumenten: [
          {
            beschreibung: "dokument 1",
          },
          {
            beschreibung: "dokument 2",
          },
          {
            beschreibung: "dokument 3",
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
          {
            beschreibung: "dokument 2",
            dokumentReference: "0-1",
          },
        ],
        reuseBeweiseDokument: {
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

    deleteBeweisDokumentReference(mockSession, [1, 0]);

    const expectedAbschnitte: any[] = [...abschnitte];
    expectedAbschnitte[1] = {
      beschreibung: "",
      dokumenten: [
        {
          beschreibung: "dokument 1",
          dokumentReference: "0-0",
        },
        {
          beschreibung: "dokument 2",
          dokumentReference: "0-1",
        },
      ],
      reuseBeweiseDokument: {
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

  it("should delete all reuseBeweiseDokument when it does not have more references", () => {
    const abschnitte = [
      {
        beschreibung: "",
        dokumenten: [
          {
            beschreibung: "dokument 1",
          },
          {
            beschreibung: "dokument 2",
          },
          {
            beschreibung: "dokument 3",
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
          "0-1": "off",
          "0-2": "off",
        },
      },
    ];

    const userData = {
      abschnitte,
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession(userData);

    deleteBeweisDokumentReference(mockSession, [1, 0]);

    const expectedAbschnitte: any[] = [...abschnitte];
    expectedAbschnitte[1] = {
      beschreibung: "",
      dokumenten: [
        {
          beschreibung: "dokument 1",
          dokumentReference: "0-0",
        },
      ],
    };

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({ abschnitte: expectedAbschnitte }),
      expect.any(Function),
    );
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

    deleteBeweisDokumentReference(mockSession, [0, 0]);

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
});
