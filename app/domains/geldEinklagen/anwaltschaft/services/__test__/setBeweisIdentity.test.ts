import { createSession, type Session } from "react-router";
import { geldEinklagenAnwaltschaft } from "../../index";
import { type GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { setBeweisIdentity } from "../setBeweisIdentity";

vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(
    (session: Session, userData: Record<string, unknown>) => {
      for (const [key, value] of Object.entries(userData))
        session.set(key, value);
    },
  ),
}));

const createUserData = () =>
  ({
    hauptantrag: [
      {
        absaetze: [
          {
            formulierung: "Hauptantrag Absatz",
            beweise: [
              {
                id: "11111111-1111-4111-8111-111111111111",
                type: "augenschein",
                beschreibung: "Hauptantrag Beweis",
              },
              {
                type: "augenschein",
                beschreibung: "Hauptantrag Entwurf",
              },
            ],
          },
        ],
        nebenantraege: [
          {
            type: "nebenantrag",
            nebenantragArt: "mahnkosten",
            nebenantragBetrag: "10",
            nebenantragZinsbeginn: { day: "", month: "" },
            nebenantragZinsende: { day: "", month: "" },
            absaetze: [
              {
                formulierung: "Nebenantrag Absatz",
                beweise: [
                  {
                    type: "augenschein",
                    beschreibung: "Nebenantrag Entwurf",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }) as GeldEinklagenAnwaltschaftUserData;

describe("setBeweisIdentity", () => {
  it("sets the submitted Hauptantrag evidence type and preserves existing IDs", async () => {
    const userData = createUserData();
    const session = createSession(userData);

    await setBeweisIdentity("urkunde", true)(
      new Request(
        "http://localhost/tatsachenvortrag-beweise/hauptantrag/0/absaetze/0/beweise/1/augenschein-daten",
      ),
      userData,
      session,
    );

    const saved = session.get("hauptantrag") as typeof userData.hauptantrag;
    const savedBeweise = saved?.[0]?.absaetze?.[0]?.beweise;
    expect(savedBeweise).toEqual([
      {
        id: "11111111-1111-4111-8111-111111111111",
        type: "augenschein",
        beschreibung: "Hauptantrag Beweis",
      },
      {
        id: expect.any(String),
        type: "urkunde",
        beschreibung: "Hauptantrag Entwurf",
      },
    ]);
  });

  it("sets the submitted Nebenantrag evidence type in its nested array", async () => {
    const userData = createUserData();
    const session = createSession(userData);

    await setBeweisIdentity("urkunde", false)(
      new Request(
        "http://localhost/tatsachenvortrag-beweise/hauptantrag/0/nebenantraege/0/absaetze/0/beweise/0/augenschein-daten",
      ),
      userData,
      session,
    );

    const saved = session.get("hauptantrag") as typeof userData.hauptantrag;
    expect(saved?.[0]?.nebenantraege?.[0]).toMatchObject({
      absaetze: [
        {
          beweise: [
            {
              id: expect.any(String),
              type: "urkunde",
              beschreibung: "Nebenantrag Entwurf",
            },
          ],
        },
      ],
    });
  });

  it("uses the nested evidence array for the Nebenantrag flow action", async () => {
    const stepId =
      "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze/#/beweise/#/augenschein-daten";
    const action = geldEinklagenAnwaltschaft.posFlowActions[stepId];
    if (action === undefined) throw new Error(`Missing flow action: ${stepId}`);

    const userData = createUserData();
    const session = createSession(userData);
    await action(
      new Request(
        "http://localhost/tatsachenvortrag-beweise/hauptantrag/0/nebenantraege/0/absaetze/0/beweise/0/augenschein-daten",
      ),
      userData,
      session,
    );

    const saved = session.get("hauptantrag") as typeof userData.hauptantrag;
    expect(saved?.[0]?.nebenantraege?.[0]).toMatchObject({
      absaetze: [
        {
          beweise: [
            {
              id: expect.any(String),
              type: "augenschein",
              beschreibung: "Nebenantrag Entwurf",
            },
          ],
        },
      ],
    });
  });

  it.each([
    {
      step: "/tatsachenvortrag-beweise/hauptantrag/#/absaetze/#/beweise/#/parteivernehmung-daten",
      url: "http://localhost/tatsachenvortrag-beweise/hauptantrag/0/absaetze/0/beweise/1/parteivernehmung-daten",
      nested: false,
    },
    {
      step: "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze/#/beweise/#/parteivernehmung-daten",
      url: "http://localhost/tatsachenvortrag-beweise/hauptantrag/0/nebenantraege/0/absaetze/0/beweise/0/parteivernehmung-daten",
      nested: true,
    },
  ])(
    "sets Parteivernehmung identity for $step",
    async ({ step, url, nested }) => {
      const userData = createUserData();
      const session = createSession(userData);
      const action =
        geldEinklagenAnwaltschaft.posFlowActions[
          step as keyof typeof geldEinklagenAnwaltschaft.posFlowActions
        ];
      await action(new Request(url), userData, session);
      const saved = session.get("hauptantrag") as typeof userData.hauptantrag;
      const evidence = nested
        ? saved?.[0]?.nebenantraege?.[0]?.absaetze?.[0]?.beweise?.[0]
        : saved?.[0]?.absaetze?.[0]?.beweise?.[1];
      expect(evidence).toMatchObject({
        type: "parteivernehmung",
        id: expect.any(String),
      });
    },
  );

  it("throws when the submitted evidence item does not exist", () => {
    const userData = createUserData();

    expect(() =>
      setBeweisIdentity("urkunde", true)(
        new Request(
          "http://localhost/tatsachenvortrag-beweise/hauptantrag/0/absaetze/0/beweise/3/augenschein-daten",
        ),
        userData,
        createSession(userData),
      ),
    ).toThrow("Missing Beweis item");
  });
});
