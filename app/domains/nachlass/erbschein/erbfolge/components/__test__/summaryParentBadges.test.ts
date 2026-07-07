import { describe, expect, it } from "vitest";
import { siblingBadgeLabel } from "../ElternteilSummary";
import { collectDescendantsWithParentName } from "../KinderSummary";

describe("siblingBadgeLabel", () => {
  const elternteile = [
    { name: "Elternteil A", isAlive: "no" },
    { name: "Elternteil B", isAlive: "no" },
  ];

  it("uses the assigned parent's name", () => {
    expect(
      siblingBadgeLabel(
        { name: "Geschwister", parentElternteilIndex: "1" },
        elternteile,
        "Elternteil A",
      ),
    ).toBe("Kind von Elternteil B");
  });

  it("labels a 'both' sibling as child of both parents", () => {
    expect(
      siblingBadgeLabel(
        { name: "Geschwister", parentElternteilIndex: "both" },
        elternteile,
        "Elternteil A",
      ),
    ).toBe("Kind von beiden Elternteilen");
  });

  it("falls back to the physical parent when no index is set", () => {
    expect(
      siblingBadgeLabel({ name: "Geschwister" }, elternteile, "Elternteil A"),
    ).toBe("Kind von Elternteil A");
  });

  // Stale-data guard: mirrors the inheritance calc — an assignment pointing at a
  // living parent is ignored in favour of the physical parent.
  it("falls back to the physical parent when the assigned parent is alive", () => {
    expect(
      siblingBadgeLabel(
        { name: "Geschwister", parentElternteilIndex: "1" },
        [
          { name: "Elternteil A", isAlive: "no" },
          { name: "Elternteil B", isAlive: "yes" },
        ],
        "Elternteil A",
      ),
    ).toBe("Kind von Elternteil A");
  });

  it("falls back to the physical parent for an out-of-range index", () => {
    expect(
      siblingBadgeLabel(
        { name: "Geschwister", parentElternteilIndex: "5" },
        elternteile,
        "Elternteil A",
      ),
    ).toBe("Kind von Elternteil A");
  });
});

type KindItems = Parameters<typeof collectDescendantsWithParentName>[0];

describe("collectDescendantsWithParentName", () => {
  const items = [
    {
      name: "Kind 1",
      isAlive: "no",
      hatteKinder: "yes",
      kinder: [
        { name: "Enkelkind 1", isAlive: "yes", parentKindIndex: "0" },
        { name: "Enkelkind 2", isAlive: "yes", parentKindIndex: "1" },
      ],
    },
    { name: "Kind 2", isAlive: "no", hatteKinder: "yes" },
  ] as unknown as KindItems;

  it("resolves the parent name from parentKindIndex", () => {
    const entries = collectDescendantsWithParentName(items, 2);
    expect(entries.map((entry) => entry.directParentName)).toEqual([
      "Kind 1",
      "Kind 2",
    ]);
  });

  // Stale-data guard: mirrors the inheritance calc — an assignment pointing at a
  // living member is ignored in favour of the physical parent.
  it("falls back to the physical parent when the assigned member is alive", () => {
    const staleItems = [
      {
        name: "Kind 1",
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [{ name: "Enkelkind 1", isAlive: "yes", parentKindIndex: "1" }],
      },
      { name: "Kind 2", isAlive: "yes" },
    ] as unknown as KindItems;
    const entries = collectDescendantsWithParentName(staleItems, 2);
    expect(entries[0].directParentName).toBe("Kind 1");
  });

  it("falls back to the physical parent when no index is set", () => {
    const unsetItems = [
      {
        name: "Kind 1",
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [{ name: "Enkelkind 1", isAlive: "yes" }],
      },
    ] as unknown as KindItems;
    const entries = collectDescendantsWithParentName(unsetItems, 2);
    expect(entries[0].directParentName).toBe("Kind 1");
  });
});
