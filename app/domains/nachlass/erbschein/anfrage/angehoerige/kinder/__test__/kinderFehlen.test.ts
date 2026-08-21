import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { nachlassErbscheinAnfrageFlowConfig } from "~/domains/nachlass/erbschein/anfrage/flowConfig";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

type UserData = Parameters<typeof createFlowSession>[1];

// Guards on kindSummary read the pruned user data, so every ancestor page has to
// stay reachable — otherwise the fields they inspect are stripped before the guard runs.
const happyPathData: NachlassErbscheinAnfrageUserData = {
  datenverarbeitungZustimmung: "on",
  verstorbeneVorname: "Max",
  verstorbeneNachname: "Mustermann",
  verstorbenePersonStrasse: "Musterstraße",
  verstorbenePersonHausnummer: "1",
  verstorbenePersonOrt: "Musterstadt",
  antragstellendePersonRelationshipToErblasser: "cousin",
  testamentArt: "none",
  verstorbeneFamilienstand: "ledig",
};

const alive = (vorname: string, nachname: string) => ({
  vorname,
  nachname,
  geburtsdatum: { day: "01", month: "01", year: "1990" },
  geburtsort: "Musterstadt",
  isAlive: "yes" as const,
  strasse: "Musterstraße",
  hausnummer: "1",
  plz: "12345",
  ort: "Musterstadt",
  land: "Deutschland",
});

const dead = (vorname: string, nachname: string) => ({
  vorname,
  nachname,
  geburtsdatum: { day: "01", month: "01", year: "1990" },
  geburtsort: "Musterstadt",
  isAlive: "no" as const,
  sterbedatum: { day: "01", month: "01", year: "2020" },
  sterbeort: "Musterstadt",
});

describe("kinderFehlen: a dead person stated to have kids but none were added", () => {
  it("routes from kindSummary to kinderFehlen when the deceased stated hatteKinder=yes but kinder is empty", () => {
    const session = createFlowSession(
      nachlassErbscheinAnfrageFlowConfig,
      {
        ...happyPathData,
        hatteKinder: "yes",
        kinder: [],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/angehoerige/kinder/uebersicht",
    );

    expect(session.nextPath).toBe("/angehoerige/kinder-fehlen");
  });

  it("routes from kindSummary to kinderFehlen when a dead kind's kinder array is empty", () => {
    const session = createFlowSession(
      nachlassErbscheinAnfrageFlowConfig,
      {
        ...happyPathData,
        hatteKinder: "yes",
        kinder: [{ ...dead("Kind", "Eins"), hatteKinder: "yes" }],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/angehoerige/kinder/uebersicht",
    );

    expect(session.nextPath).toBe("/angehoerige/kinder-fehlen");
  });

  it("does not route to kinderFehlen once the missing kinder are filled in", () => {
    const session = createFlowSession(
      nachlassErbscheinAnfrageFlowConfig,
      {
        ...happyPathData,
        hatteKinder: "yes",
        kinder: [
          {
            ...dead("Kind", "Eins"),
            hatteKinder: "yes",
            kinder: [alive("Enkel", "Eins")],
          },
        ],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/angehoerige/kinder/uebersicht",
    );

    expect(session.nextPath).not.toBe("/angehoerige/kinder-fehlen");
  });

  it("keeps Kind 1 flagged, not Kind 2, when Kind 1's grandchild is reassigned to Kind 2 via parentKindIndex", () => {
    // Both dead kids said hatteKinder=yes with no kinder yet. A grandchild is
    // then added and, via the dynamic parent select, assigned to Kind 2 — but
    // it's physically stored under Kind 1 (the array-add flow's shared entry
    // point). Kind 1's own branch is now the empty one, not Kind 2's.
    const session = createFlowSession(
      nachlassErbscheinAnfrageFlowConfig,
      {
        ...happyPathData,
        hatteKinder: "yes",
        kinder: [
          {
            ...dead("Kind", "Eins"),
            hatteKinder: "yes",
            kinder: [{ ...alive("Enkel", "Eins"), parentKindIndex: "1" }],
          },
          { ...dead("Kind", "Zwei"), hatteKinder: "yes" },
        ],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/angehoerige/kinder/uebersicht",
    );

    expect(session.nextPath).toBe("/angehoerige/kinder-fehlen");
  });

  it("no longer routes to kinderFehlen once every branch has a reassigned descendant", () => {
    const session = createFlowSession(
      nachlassErbscheinAnfrageFlowConfig,
      {
        ...happyPathData,
        hatteKinder: "yes",
        kinder: [
          {
            ...dead("Kind", "Eins"),
            hatteKinder: "yes",
            kinder: [
              { ...alive("Enkel", "A"), parentKindIndex: "0" },
              { ...alive("Enkel", "B"), parentKindIndex: "1" },
            ],
          },
          { ...dead("Kind", "Zwei"), hatteKinder: "yes" },
        ],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/angehoerige/kinder/uebersicht",
    );

    expect(session.nextPath).not.toBe("/angehoerige/kinder-fehlen");
  });

  it("prioritizes the depth-limit exit page over kinderFehlen at the deepest supported generation", () => {
    const session = createFlowSession(
      nachlassErbscheinAnfrageFlowConfig,
      {
        ...happyPathData,
        hatteKinder: "yes",
        kinder: [
          {
            ...dead("Kind", "Eins"),
            hatteKinder: "yes",
            kinder: [
              {
                ...dead("Kind", "Zwei"),
                hatteKinder: "yes",
                kinder: [
                  {
                    ...dead("Kind", "Drei"),
                    hatteKinder: "yes",
                    kinder: [
                      {
                        ...dead("Kind", "Vier"),
                        hatteKinder: "yes",
                        kinder: [
                          { ...dead("Kind", "Fuenf"), hatteKinder: "yes" },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/angehoerige/kinder/uebersicht",
    );

    expect(session.nextPath).toBe("/angehoerige/uebersicht");
  });
});
