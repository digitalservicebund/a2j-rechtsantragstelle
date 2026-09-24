import { createSession } from "react-router";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../formular/klage-erstellen/userData";
import { copyOrRemoveReferenceDocuments } from "../copyOrRemoveReferenceDocuments";
import { type Session } from "react-router";
import { updateSession } from "~/services/session.server";

vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const mockRequestUrl =
  "http://localhost:3000/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/2/beweis-dokument-wiederverwenden";

describe("copyOrRemoveReferenceDocuments", () => {
  it("should not call updateSession if abschnitte is empty", async () => {
    const userData = {
      abschnitte: [],
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession();
    const request = new Request(mockRequestUrl);

    await copyOrRemoveReferenceDocuments(request, userData, mockSession);

    expect(updateSession).not.toHaveBeenCalled();
  });

  it("should not call updateSession if does not contains arrayIndex on the url", async () => {
    const userData = {
      abschnitte: [],
    } as GeldEinklagenFormularKlageErstellenUserData;

    const mockSession: Session = createSession();
    const request = new Request(
      "http://localhost:3000/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/beweis-dokument-wiederverwenden",
    );

    await copyOrRemoveReferenceDocuments(request, userData, mockSession);

    expect(updateSession).not.toHaveBeenCalled();
  });

  it("should copy a document reference from another abschnitt", async () => {
    const abschnitte = [
      {
        beschreibung: "beschreibung 1",
        dokumenten: [
          {
            beschreibung: "dokumenten 1",
          },
          {
            beschreibung: "dokumenten 2",
          },
        ],
      },
      {
        beschreibung: "beschreibung 2",
        dokumenten: [
          {
            beschreibung: "dokumenten 3",
          },
        ],
      },
      {
        beschreibung: "beschreibung 3",
        reuseBeweiseDokument: {
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

    await copyOrRemoveReferenceDocuments(request, userData, mockSession);

    const expectedAbschnitte: any[] = [...abschnitte];
    expectedAbschnitte[2] = {
      beschreibung: "beschreibung 3",
      dokumenten: [
        {
          beschreibung: "dokumenten 1",
          dokumentReference: "0-0",
        },
        {
          beschreibung: "dokumenten 3",
          dokumentReference: "1-0",
        },
      ],
      reuseBeweiseDokument: {
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

  it("should remove an existing document reference from another abschnitt", async () => {
    const abschnitte = [
      {
        beschreibung: "beschreibung 1",
        dokumenten: [
          {
            beschreibung: "dokumenten 1",
          },
          {
            beschreibung: "dokumenten 2",
          },
        ],
      },
      {
        beschreibung: "beschreibung 2",
        dokumenten: [
          {
            beschreibung: "dokumenten 1",
            dokumentReference: "0-0",
          },
          {
            beschreibung: "dokumenten 2",
            dokumentReference: "0-1",
          },
        ],
        reuseBeweiseDokument: {
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
      "http://localhost:3000/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/1/beweis-dokument-wiederverwenden",
    );

    await copyOrRemoveReferenceDocuments(request, userData, mockSession);

    const expectedAbschnitte: any[] = [...abschnitte];
    expectedAbschnitte[1] = {
      beschreibung: "beschreibung 2",
      dokumenten: [],
      reuseBeweiseDokument: {
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
