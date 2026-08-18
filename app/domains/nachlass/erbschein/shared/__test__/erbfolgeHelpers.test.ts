import { getEligibleKind } from "../erbfolgeHelpers";
import { type BaseKind } from "../erbfolgeTypes";

const aliveKind = (): BaseKind => ({
  vorname: "Lebendes Kind",
  nachname: "Mustermann",
  isAlive: "yes",
});

const deceasedKindWithChildren = (kinder: BaseKind[] = []): BaseKind => ({
  vorname: "Verstorbenes Kind",
  nachname: "Mustermann",
  isAlive: "no",
  hatteKinder: "yes",
  kinder,
});

const deceasedKindWithoutChildren = (): BaseKind => ({
  vorname: "Verstorbenes Kind",
  nachname: "Mustermann",
  isAlive: "no",
  hatteKinder: "no",
});

describe("getEligibleKind", () => {
  it("returns the indexed descendant at the maximum supported depth", () => {
    const kind5 = deceasedKindWithChildren();
    const kinder = [
      deceasedKindWithChildren([
        deceasedKindWithChildren([
          deceasedKindWithChildren([deceasedKindWithChildren([kind5])]),
        ]),
      ]),
    ];

    expect(getEligibleKind(kinder, [0, 0, 0, 0, 0], 5)).toBe(kind5);
  });

  it("returns the current child even when that child is alive", () => {
    const kind = aliveKind();

    expect(getEligibleKind([kind], [0], 1)).toBe(kind);
  });

  it.each([
    [undefined, [0], 1],
    [[], undefined, 1],
    [[], [0], 1],
    [[deceasedKindWithChildren()], [0], 2],
  ] as Array<Parameters<typeof getEligibleKind>>)(
    "returns undefined when the requested child cannot be resolved",
    (kinder, arrayIndexes, depth) => {
      expect(getEligibleKind(kinder, arrayIndexes, depth)).toBeUndefined();
    },
  );

  it("returns undefined when an ancestor is alive", () => {
    const kinder = [aliveKind()];

    expect(getEligibleKind(kinder, [0, 0], 2)).toBeUndefined();
  });

  it("returns undefined when an ancestor did not have children", () => {
    const kinder = [deceasedKindWithoutChildren()];

    expect(getEligibleKind(kinder, [0, 0], 2)).toBeUndefined();
  });
});
