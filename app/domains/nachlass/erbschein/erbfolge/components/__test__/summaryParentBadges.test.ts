import { describe, expect, it } from "vitest";
import { siblingBadgeLabel } from "../ElternteilSummary";
import { collectDescendantsWithParentName } from "../summaryTree";

describe("siblingBadgeLabel", () => {
  const elternteile = [
    { vorname: "Elternteil A", isAlive: "no" },
    { vorname: "Elternteil B", isAlive: "no" },
  ];

  it("uses the assigned parent's name", () => {
    expect(
      siblingBadgeLabel(
        { vorname: "Geschwister", parentElternteilIndex: "1" },
        elternteile,
        "Elternteil A",
      ),
    ).toBe("Kind von Elternteil B");
  });

  it("labels a 'both' sibling as child of both parents", () => {
    expect(
      siblingBadgeLabel(
        { vorname: "Geschwister", parentElternteilIndex: "both" },
        elternteile,
        "Elternteil A",
      ),
    ).toBe("Kind von beiden Elternteilen");
  });

  it("falls back to the physical parent when no index is set", () => {
    expect(
      siblingBadgeLabel(
        { vorname: "Geschwister" },
        elternteile,
        "Elternteil A",
      ),
    ).toBe("Kind von Elternteil A");
  });

  // Stale-data guard: mirrors the inheritance calc — an assignment pointing at a
  // living parent is ignored in favour of the physical parent.
  it("falls back to the physical parent when the assigned parent is alive", () => {
    expect(
      siblingBadgeLabel(
        { vorname: "Geschwister", parentElternteilIndex: "1" },
        [
          { vorname: "Elternteil A", isAlive: "no" },
          { vorname: "Elternteil B", isAlive: "yes" },
        ],
        "Elternteil A",
      ),
    ).toBe("Kind von Elternteil A");
  });

  it("falls back to the physical parent for an out-of-range index", () => {
    expect(
      siblingBadgeLabel(
        { vorname: "Geschwister", parentElternteilIndex: "5" },
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
      vorname: "Kind 1",
      isAlive: "no",
      hatteKinder: "yes",
      kinder: [
        { vorname: "Enkelkind 1", isAlive: "yes", parentKindIndex: "0" },
        { vorname: "Enkelkind 2", isAlive: "yes", parentKindIndex: "1" },
      ],
    },
    { vorname: "Kind 2", isAlive: "no", hatteKinder: "yes" },
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
        vorname: "Kind 1",
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [
          { vorname: "Enkelkind 1", isAlive: "yes", parentKindIndex: "1" },
        ],
      },
      { vorname: "Kind 2", isAlive: "yes" },
    ] as unknown as KindItems;
    const entries = collectDescendantsWithParentName(staleItems, 2);
    expect(entries[0].directParentName).toBe("Kind 1");
  });

  it("falls back to the physical parent when no index is set", () => {
    const unsetItems = [
      {
        vorname: "Kind 1",
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [{ vorname: "Enkelkind 1", isAlive: "yes" }],
      },
    ] as unknown as KindItems;
    const entries = collectDescendantsWithParentName(unsetItems, 2);
    expect(entries[0].directParentName).toBe("Kind 1");
  });
});
