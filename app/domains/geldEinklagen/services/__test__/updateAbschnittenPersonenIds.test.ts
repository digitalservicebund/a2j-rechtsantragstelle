import { createSession, type Session } from "react-router";
import { type GeldEinklagenFormularUserData } from "../../formular/userData";
import { updateAbschnittenPersonenIds } from "../updateAbschnittenPersonenIds";
import { updateSession } from "~/services/session.server";

vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateAbschnittenPersonenIds", () => {
  it("should update the personenIds in the abschnitte and call updateSession", async () => {
    const userData = {
      abschnitte: [
        {
          personen: [
            { personAuswahl: "klagende", personId: "123" },
            { personAuswahl: "beklagte", personId: "456" },
          ],
        },
        {
          personen: [
            { personAuswahl: "klagende", personId: "789" },
            { personAuswahl: "beklagte", personId: "012" },
          ],
        },
      ],
    } as GeldEinklagenFormularUserData;

    const mockSession: Session = createSession();

    await updateAbschnittenPersonenIds({} as Request, userData, mockSession);

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({
        abschnitte: [
          {
            personen: [
              { personAuswahl: "klagende", personId: "123" },
              { personAuswahl: "beklagte", personId: "456" },
            ],
            personIdAsKlagende: "123",
            personIdAsBeklagte: "456",
          },
          {
            personen: [
              { personAuswahl: "klagende", personId: "789" },
              { personAuswahl: "beklagte", personId: "012" },
            ],
            personIdAsKlagende: "789",
            personIdAsBeklagte: "012",
          },
        ],
      }),
    );
  });

  it("should not call updateSession if there are no abschnitte", async () => {
    const userData = {
      abschnitte: [],
    } as GeldEinklagenFormularUserData;

    const mockSession: Session = createSession();

    await updateAbschnittenPersonenIds({} as Request, userData, mockSession);

    expect(updateSession).not.toHaveBeenCalled();
  });

  it("should handle abschnitte without personen and set personIdAsKlagende and personIdAsBeklagte to empty strings", async () => {
    const userData = {
      abschnitte: [
        {
          beschreibung: "Abschnitt ohne Personen",
          personen: [],
        },
      ],
    } as GeldEinklagenFormularUserData;

    const mockSession: Session = createSession();

    await updateAbschnittenPersonenIds({} as Request, userData, mockSession);

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({
        abschnitte: [
          {
            beschreibung: "Abschnitt ohne Personen",
            personen: [],
            personIdAsKlagende: "",
            personIdAsBeklagte: "",
          },
        ],
      }),
    );
  });
});
