import { createSession, type Session } from "react-router";
import { geldEinklagenAnwaltschaft } from "../../index";
import { setNebenantragType } from "../setNebenantragType";

vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(
    (session: Session, userData: Record<string, unknown>) => {
      for (const [key, value] of Object.entries(userData))
        session.set(key, value);
    },
  ),
}));

describe("setNebenantragType", () => {
  it.each([
    { page: "nebenantraege", type: "nebenantrag" },
    { page: "annahmeverzug", type: "annahmeverzug" },
  ] as const)(
    "persists $type through its flow action without changing other items",
    async ({ page, type }) => {
      const draft =
        type === "nebenantrag"
          ? { nebenantragArt: "mahnkosten", nebenantragBetrag: "10" }
          : { annahmeverzugsFeststellung: "on" };
      const userData = {
        hauptantrag: [
          { nebenantraege: [{ type: "nebenantrag" }] },
          {
            internesSchlagwortFordureung: "Forderung",
            nebenantraege: [
              { type: "annahmeverzug" },
              {
                ...draft,
                absaetze: [{ formulierung: "Nebenantrag Absatz" }],
              },
            ],
          },
        ],
      };
      const session = createSession(userData);
      const stepId =
        `/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/#/${page}/#/daten` as const;
      const action = geldEinklagenAnwaltschaft.posFlowActions[stepId];
      const request = new Request(
        `http://localhost/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/1/${page}/1/daten`,
      );

      await action(request, userData, session);

      const expected = [
        userData.hauptantrag[0],
        {
          internesSchlagwortFordureung: "Forderung",
          nebenantraege: [
            { type: "annahmeverzug" },
            {
              ...draft,
              type,
              absaetze: [{ formulierung: "Nebenantrag Absatz" }],
            },
          ],
        },
      ];
      expect(session.get("hauptantrag")).toEqual(expected);

      await action(request, session.data, session);
      expect(session.get("hauptantrag")).toEqual(expected);
    },
  );

  it.each([
    "/daten",
    "/0/daten",
    "/0/nebenantraege/0/daten",
    "/1/nebenantraege/0/daten",
    "/0/nebenantraege/2/daten",
  ])("rejects a missing Nebenantrag at %s", (path) => {
    const userData = {
      hauptantrag: [{ nebenantraege: [] }],
    };

    expect(() =>
      setNebenantragType("nebenantrag")(
        new Request(`http://localhost${path}`),
        userData,
        createSession(userData),
      ),
    ).toThrow("Missing Nebenantrag item");
  });
});
