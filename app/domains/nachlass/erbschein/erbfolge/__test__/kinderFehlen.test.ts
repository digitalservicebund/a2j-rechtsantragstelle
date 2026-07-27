import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { nachlassErbfolgeStaticFlow } from "../flowConfig";

type UserData = Parameters<typeof createFlowSession>[1];

describe("kinderFehlen: a dead person stated to have kids but none were added", () => {
  it("routes from kind1Summary to kinderFehlen when the deceased stated hatteKinder=yes but kinder is empty", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      {
        name: "Verstorbene Person",
        hatteKinder: "yes",
        kinder: [],
        elternteile: [],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/kinder",
    );

    expect(session.nextPath).toBe("/kinder-fehlen");
  });

  it("routes from kind1Summary to kinderFehlen when a dead kind's kinder array is empty", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      {
        hatteKinder: "yes",
        kinder: [{ name: "Kind 1", isAlive: "no", hatteKinder: "yes" }],
        elternteile: [],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/kinder",
    );

    expect(session.nextPath).toBe("/kinder-fehlen");
  });

  it("does not route to kinderFehlen once the missing kinder are filled in", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      {
        hatteKinder: "yes",
        kinder: [
          {
            name: "Kind 1",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [{ name: "Enkel", isAlive: "yes" }],
          },
        ],
        elternteile: [],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/kinder",
    );

    expect(session.nextPath).not.toBe("/kinder-fehlen");
  });

  it("routes from elternteilSummary to kinderFehlen when a dead Elternteil's kinder array is empty", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      {
        hatteKinder: "no",
        elternteile: [
          { name: "Elternteil A", isAlive: "no", hatteKinder: "yes" },
        ],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/elternteile",
    );

    expect(session.nextPath).toBe("/kinder-fehlen");
  });

  it("keeps Kind 1 flagged, not Kind 2, when Kind 1's grandchild is reassigned to Kind 2 via parentKindIndex", () => {
    // Both dead kids said hatteKinder=yes with no kinder yet. A grandchild is
    // then added and, via the dynamic parent select, assigned to Kind 2 — but
    // it's physically stored under Kind 1 (the array-add flow's shared entry
    // point). Kind 1's own branch is now the empty one, not Kind 2's.
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      {
        hatteKinder: "yes",
        kinder: [
          {
            name: "Kind 1",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [{ name: "Enkel", isAlive: "yes", parentKindIndex: "1" }],
          },
          { name: "Kind 2", isAlive: "no", hatteKinder: "yes" },
        ],
        elternteile: [],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/kinder",
    );

    expect(session.nextPath).toBe("/kinder-fehlen");
  });

  it("no longer routes to kinderFehlen once every branch has a reassigned descendant", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      {
        hatteKinder: "yes",
        kinder: [
          {
            name: "Kind 1",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              { name: "Enkel A", isAlive: "yes", parentKindIndex: "0" },
              { name: "Enkel B", isAlive: "yes", parentKindIndex: "1" },
            ],
          },
          { name: "Kind 2", isAlive: "no", hatteKinder: "yes" },
        ],
        elternteile: [],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/kinder",
    );

    expect(session.nextPath).not.toBe("/kinder-fehlen");
  });

  it("prioritizes the depth-limit exit page over kinderFehlen at the deepest supported generation", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      {
        hatteKinder: "yes",
        kinder: [
          {
            name: "Kind 1",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              {
                name: "Kind 2",
                isAlive: "no",
                hatteKinder: "yes",
                kinder: [
                  {
                    name: "Kind 3",
                    isAlive: "no",
                    hatteKinder: "yes",
                    kinder: [
                      {
                        name: "Kind 4",
                        isAlive: "no",
                        hatteKinder: "yes",
                        kinder: [
                          {
                            name: "Kind 5",
                            isAlive: "no",
                            hatteKinder: "yes",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        elternteile: [],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/kinder",
    );

    expect(session.nextPath).toBe(
      "/ergebnis/erbfolge-nicht-ermittelt-weitere-generationen",
    );
  });
});
