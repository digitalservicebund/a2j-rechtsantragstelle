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

const createUserData = (): GeldEinklagenAnwaltschaftUserData => ({
  vortraege: [
    { antragId: "muendlicheVerhandlung" },
    {
      antragId: "22222222-2222-4222-8222-222222222222",
      absaetze: [
        {
          formulierung: "Absatz",
          beweise: [
            {
              id: "11111111-1111-4111-8111-111111111111",
              type: "augenschein",
              beschreibung: "Beweis",
            },
            { type: "augenschein", beschreibung: "Entwurf" },
          ],
        },
      ],
    },
  ],
});

const beweisUrl = (index: number, type = "augenschein") =>
  `http://localhost/tatsachenvortrag-beweise/vortraege/1/absaetze/0/beweise/${index}/${type}-daten`;

describe("setBeweisIdentity", () => {
  it("sets the submitted evidence type and preserves existing IDs", async () => {
    const userData = createUserData();
    const session = createSession(userData);

    await setBeweisIdentity("urkunde")(
      new Request(beweisUrl(1)),
      userData,
      session,
    );

    const saved = session.get("vortraege") as typeof userData.vortraege;
    expect(saved?.[1]?.absaetze?.[0]?.beweise).toEqual([
      {
        id: "11111111-1111-4111-8111-111111111111",
        type: "augenschein",
        beschreibung: "Beweis",
      },
      { id: expect.any(String), type: "urkunde", beschreibung: "Entwurf" },
    ]);
  });

  it.each([
    "augenschein",
    "urkunde",
    "sachverstaendigengutachten",
    "zeuge",
    "parteivernehmung",
  ] as const)("is registered as flow action for %s", async (type) => {
    const action =
      geldEinklagenAnwaltschaft.posFlowActions[
        `/tatsachenvortrag-beweise/vortraege/#/absaetze/#/beweise/#/${type}-daten`
      ];
    const userData = createUserData();
    const session = createSession(userData);

    await action(new Request(beweisUrl(1, type)), userData, session);

    const saved = session.get("vortraege") as typeof userData.vortraege;
    expect(saved?.[1]?.absaetze?.[0]?.beweise?.[1]).toMatchObject({
      type,
      id: expect.any(String),
    });
  });

  it("throws when the submitted evidence item does not exist", () => {
    const userData = createUserData();

    expect(() =>
      setBeweisIdentity("urkunde")(
        new Request(beweisUrl(3)),
        userData,
        createSession(userData),
      ),
    ).toThrow("Missing Beweis item");
  });
});
