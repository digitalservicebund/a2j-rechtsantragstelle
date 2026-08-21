import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { nachlassErbscheinAnfrageFlowConfig } from "~/domains/nachlass/erbschein/anfrage/flowConfig";
import { nachlassErbscheinAnfrageHappyPathData } from "~/domains/nachlass/erbschein/anfrage/__test__/mockTestData";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { BOTH_PARENTS_VALUE } from "~/domains/nachlass/erbschein/shared/buildParentOptions";

type UserData = Parameters<typeof createFlowSession>[1];

const happyPathData: NachlassErbscheinAnfrageUserData = {
  ...nachlassErbscheinAnfrageHappyPathData,
  testamentArt: "none",
  verstorbeneFamilienstand: "ledig",
};

const person = {
  geburtsdatum: { day: "01", month: "01", year: "1990" },
  geburtsort: "Musterstadt",
};

const alive = (vorname: string, nachname: string) => ({
  ...person,
  vorname,
  nachname,
  isAlive: "yes",
  strasse: "Musterstraße",
  hausnummer: "1",
  plz: "12345",
  ort: "Musterstadt",
  land: "Deutschland",
});

const dead = (vorname: string, nachname: string) => ({
  ...person,
  vorname,
  nachname,
  isAlive: "no",
  sterbedatum: { day: "01", month: "01", year: "2020" },
  sterbeort: "Musterstadt",
});

// elternteilSummary is only reachable once the 1st order is extinct, so every
// case carries a kinder branch with no living descendants.
const sessionAtSummary = (elternteile: object[]) =>
  createFlowSession(
    nachlassErbscheinAnfrageFlowConfig,
    {
      ...happyPathData,
      hatteKinder: "yes",
      kinder: [{ ...dead("Kind", "Eins"), hatteKinder: "no" }],
      elternteile,
      pageData: { arrayIndexes: [] },
    } as UserData,
    "/angehoerige/elternteile/uebersicht",
  );

describe("kinderFehlen: a dead Elternteil stated to have kids but none were added", () => {
  it("routes from elternteilSummary to kinderFehlen when a dead Elternteil's kinder array is empty", () => {
    const session = sessionAtSummary([
      { ...dead("Elternteil", "A"), hatteKinder: "yes" },
    ]);

    expect(session.nextPath).toBe("/angehoerige/kinder-fehlen");
  });

  it("routes to kinderFehlen when a dead sibling further down has no kinder", () => {
    const session = sessionAtSummary([
      {
        ...dead("Elternteil", "A"),
        hatteKinder: "yes",
        kinder: [{ ...dead("Geschwister", "Eins"), hatteKinder: "yes" }],
      },
    ]);

    expect(session.nextPath).toBe("/angehoerige/kinder-fehlen");
  });

  it("does not route to kinderFehlen once the missing kinder are filled in", () => {
    const session = sessionAtSummary([
      {
        ...dead("Elternteil", "A"),
        hatteKinder: "yes",
        kinder: [alive("Geschwister", "Eins")],
      },
    ]);

    expect(session.nextPath).not.toBe("/angehoerige/kinder-fehlen");
  });

  it("keeps Elternteil A flagged, not Elternteil B, when A's sibling is reassigned to B via parentElternteilIndex", () => {
    // Both dead parents said hatteKinder=yes with no kinder yet. A sibling is
    // then added and, via the dynamic parent select, assigned to Elternteil B —
    // but it's physically stored under Elternteil A (the array-add flow's shared
    // entry point). A's own branch is now the empty one, not B's.
    const session = sessionAtSummary([
      {
        ...dead("Elternteil", "A"),
        hatteKinder: "yes",
        kinder: [
          { ...alive("Geschwister", "Eins"), parentElternteilIndex: "1" },
        ],
      },
      { ...dead("Elternteil", "B"), hatteKinder: "yes" },
    ]);

    expect(session.nextPath).toBe("/angehoerige/kinder-fehlen");
  });

  it("no longer routes to kinderFehlen once every parent has a reassigned sibling", () => {
    const session = sessionAtSummary([
      {
        ...dead("Elternteil", "A"),
        hatteKinder: "yes",
        kinder: [
          { ...alive("Geschwister", "Eins"), parentElternteilIndex: "0" },
          { ...alive("Geschwister", "Zwei"), parentElternteilIndex: "1" },
        ],
      },
      { ...dead("Elternteil", "B"), hatteKinder: "yes" },
    ]);

    expect(session.nextPath).not.toBe("/angehoerige/kinder-fehlen");
  });

  it("counts a sibling assigned to both parents toward each of their branches", () => {
    const session = sessionAtSummary([
      {
        ...dead("Elternteil", "A"),
        hatteKinder: "yes",
        kinder: [
          {
            ...alive("Geschwister", "Eins"),
            parentElternteilIndex: BOTH_PARENTS_VALUE,
          },
        ],
      },
      { ...dead("Elternteil", "B"), hatteKinder: "yes" },
    ]);

    expect(session.nextPath).not.toBe("/angehoerige/kinder-fehlen");
  });

  it("prioritizes the depth-limit exit page over kinderFehlen at the deepest supported generation", () => {
    const depth5 = { ...dead("Geschwister", "Fuenf"), hatteKinder: "yes" };
    const depth4 = { ...dead("Geschwister", "Vier"), hatteKinder: "yes", kinder: [depth5] }; // prettier-ignore
    const depth3 = { ...dead("Geschwister", "Drei"), hatteKinder: "yes", kinder: [depth4] }; // prettier-ignore
    const depth2 = { ...dead("Geschwister", "Zwei"), hatteKinder: "yes", kinder: [depth3] }; // prettier-ignore
    const depth1 = { ...dead("Geschwister", "Eins"), hatteKinder: "yes", kinder: [depth2] }; // prettier-ignore

    const session = sessionAtSummary([
      { ...dead("Elternteil", "A"), hatteKinder: "yes", kinder: [depth1] },
    ]);

    expect(session.nextPath).toBe("/angehoerige/uebersicht");
  });
});
