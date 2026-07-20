import { describe, expect, it } from "vitest";
import {
  calculateInheritance,
  hasNoFirstOrSecondOrderHeirs,
  requiresFurtherGenerations,
} from "../calculateInheritance";
import type {
  HeirShare,
  InheritanceInput,
  SpouseInput,
} from "../calculateInheritance";

function share(numerator: number, denominator: number): HeirShare["share"] {
  return { numerator, denominator };
}

// Order-insensitive matcher — useful when multiple heirs accumulate shares from multiple sources
function containingShares(expected: Array<Partial<HeirShare>>) {
  return expect.arrayContaining(
    expected.map((h) => expect.objectContaining(h)),
  );
}

describe("calculateInheritance", () => {
  describe("spouse (Ehepartner)", () => {
    const spouse: SpouseInput = {
      name: "Partner",
      gueterstand: "communityOfAcquisitions",
    };

    it("Zugewinngemeinschaft + 1st order: spouse 1/2, children split 1/2", () => {
      const result = calculateInheritance({
        hatteKinder: "yes",
        kinder: [
          { name: "Kind 1", isAlive: "yes" },
          { name: "Kind 2", isAlive: "yes" },
        ],
        spouse,
      });

      describe("result-page conditions", () => {
        it("detects when no first- or second-order heirs are alive", () => {
          expect(
            hasNoFirstOrSecondOrderHeirs({
              hatteKinder: "yes",
              kinder: [{ name: "Kind", isAlive: "no", hatteKinder: "no" }],
              elternteile: [
                { name: "Elternteil", isAlive: "no", hatteKinder: "no" },
              ],
            }),
          ).toBe(true);
        });

        it("does not report missing heirs while a second-order heir is alive", () => {
          expect(
            hasNoFirstOrSecondOrderHeirs({
              hatteKinder: "no",
              elternteile: [{ name: "Elternteil", isAlive: "yes" }],
            }),
          ).toBe(false);
        });

        it("detects a dead descendant in the fifth and final covered generation", () => {
          expect(
            requiresFurtherGenerations({
              hatteKinder: "yes",
              kinder: [
                {
                  name: "Generation 1",
                  isAlive: "no",
                  hatteKinder: "yes",
                  kinder: [
                    {
                      name: "Generation 2",
                      isAlive: "no",
                      hatteKinder: "yes",
                      kinder: [
                        {
                          name: "Generation 3",
                          isAlive: "no",
                          hatteKinder: "yes",
                          kinder: [
                            {
                              name: "Generation 4",
                              isAlive: "no",
                              hatteKinder: "yes",
                              kinder: [
                                {
                                  name: "Generation 5",
                                  isAlive: "no",
                                  hatteKinder: "no",
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
            }),
          ).toBe(true);
        });

        it("accepts a living descendant in the fifth generation", () => {
          expect(
            requiresFurtherGenerations({
              hatteKinder: "yes",
              kinder: [
                {
                  name: "Generation 1",
                  isAlive: "no",
                  hatteKinder: "yes",
                  kinder: [
                    {
                      name: "Generation 2",
                      isAlive: "no",
                      hatteKinder: "yes",
                      kinder: [
                        {
                          name: "Generation 3",
                          isAlive: "no",
                          hatteKinder: "yes",
                          kinder: [
                            {
                              name: "Generation 4",
                              isAlive: "no",
                              hatteKinder: "yes",
                              kinder: [
                                { name: "Generation 5", isAlive: "yes" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            }),
          ).toBe(false);
        });
      });

      expect(result).toHaveLength(3);
      expect(result).toEqual(
        containingShares([
          { name: "Partner", share: share(1, 2), order: 0 },
          { name: "Kind 1", share: share(1, 4), order: 1 },
          { name: "Kind 2", share: share(1, 4), order: 1 },
        ]),
      );
    });

    it("Zugewinngemeinschaft + 2nd order: spouse 3/4, parents split 1/4", () => {
      const result = calculateInheritance({
        hatteKinder: "no",
        elternteile: [
          { name: "Elternteil A", isAlive: "yes" },
          { name: "Elternteil B", isAlive: "yes" },
        ],
        spouse,
      });

      expect(result).toHaveLength(3);
      expect(result).toEqual(
        containingShares([
          { name: "Partner", share: share(3, 4), order: 0 },
          { name: "Elternteil A", share: share(1, 8), order: 2 },
          { name: "Elternteil B", share: share(1, 8), order: 2 },
        ]),
      );
    });

    it("Zugewinngemeinschaft + no 1st/2nd order: spouse inherits full estate", () => {
      const result = calculateInheritance({
        hatteKinder: "no",
        spouse,
      });

      expect(result).toHaveLength(1);
      expect(result).toEqual(
        containingShares([{ name: "Partner", share: share(1, 1), order: 0 }]),
      );
    });

    it("Gütertrennung + 1 Stamm: spouse and child each get 1/2", () => {
      const result = calculateInheritance({
        hatteKinder: "yes",
        kinder: [{ name: "Kind 1", isAlive: "yes" }],
        spouse: { name: "Partner", gueterstand: "separationOfProperty" },
      });

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        containingShares([
          { name: "Partner", share: share(1, 2), order: 0 },
          { name: "Kind 1", share: share(1, 2), order: 1 },
        ]),
      );
    });

    it("Gütertrennung + 2 Stämme: spouse and each child get 1/3", () => {
      const result = calculateInheritance({
        hatteKinder: "yes",
        kinder: [
          { name: "Kind 1", isAlive: "yes" },
          { name: "Kind 2", isAlive: "yes" },
        ],
        spouse: { name: "Partner", gueterstand: "separationOfProperty" },
      });

      expect(result).toHaveLength(3);
      expect(result).toEqual(
        containingShares([
          { name: "Partner", share: share(1, 3), order: 0 },
          { name: "Kind 1", share: share(1, 3), order: 1 },
          { name: "Kind 2", share: share(1, 3), order: 1 },
        ]),
      );
    });

    it("Gütertrennung + 3 Stämme: spouse gets 1/4, each Stamm gets 1/4", () => {
      const result = calculateInheritance({
        hatteKinder: "yes",
        kinder: [
          { name: "Kind 1", isAlive: "yes" },
          { name: "Kind 2", isAlive: "yes" },
          { name: "Kind 3", isAlive: "yes" },
        ],
        spouse: { name: "Partner", gueterstand: "separationOfProperty" },
      });

      expect(result).toHaveLength(4);
      expect(result).toEqual(
        containingShares([
          { name: "Partner", share: share(1, 4), order: 0 },
          { name: "Kind 1", share: share(1, 4), order: 1 },
          { name: "Kind 2", share: share(1, 4), order: 1 },
          { name: "Kind 3", share: share(1, 4), order: 1 },
        ]),
      );
    });

    it("Gütertrennung + 2nd order (no kids): spouse 1/2, parents split 1/2", () => {
      // §1931 Abs.4 only applies to 1st order. With only 2nd order relatives the
      // spouse keeps the normal 1/2 base (Gütertrennung has no +1/4 increase).
      const result = calculateInheritance({
        hatteKinder: "no",
        elternteile: [
          { name: "Elternteil A", isAlive: "yes" },
          { name: "Elternteil B", isAlive: "yes" },
        ],
        spouse: { name: "Partner", gueterstand: "separationOfProperty" },
      });

      expect(result).toEqual(
        containingShares([
          { name: "Partner", share: share(1, 2), order: 0 },
          { name: "Elternteil A", share: share(1, 4), order: 2 },
          { name: "Elternteil B", share: share(1, 4), order: 2 },
        ]),
      );
    });

    it("Gütertrennung + 2 Stämme where one child is represented by a grandchild: spouse 1/3", () => {
      // Two active Stämme (a living child + a dead child with a living grandchild)
      // count as 2 for §1931 Abs.4 — spouse gets 1/3, not 1/4.
      const result = calculateInheritance({
        hatteKinder: "yes",
        kinder: [
          { name: "Kind 1", isAlive: "yes" },
          {
            name: "Kind 2",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [{ name: "Enkel 1", isAlive: "yes" }],
          },
        ],
        spouse: { name: "Partner", gueterstand: "separationOfProperty" },
      });

      expect(result).toEqual(
        containingShares([
          { name: "Partner", share: share(1, 3), order: 0 },
          { name: "Kind 1", share: share(1, 3), order: 1 },
          { name: "Enkel 1", share: share(1, 3), order: 1 },
        ]),
      );
    });

    it("Gütergemeinschaft + 2nd order: spouse 1/2 (no increase), parents split 1/2", () => {
      const result = calculateInheritance({
        hatteKinder: "no",
        elternteile: [
          { name: "Elternteil A", isAlive: "yes" },
          { name: "Elternteil B", isAlive: "yes" },
        ],
        spouse: { name: "Partner", gueterstand: "communityOfProperty" },
      });

      expect(result).toEqual(
        containingShares([
          { name: "Partner", share: share(1, 2), order: 0 },
          { name: "Elternteil A", share: share(1, 4), order: 2 },
          { name: "Elternteil B", share: share(1, 4), order: 2 },
        ]),
      );
    });

    it("Gütergemeinschaft + 1st order: spouse 1/4, children split 3/4", () => {
      const result = calculateInheritance({
        hatteKinder: "yes",
        kinder: [
          { name: "Kind 1", isAlive: "yes" },
          { name: "Kind 2", isAlive: "yes" },
        ],
        spouse: { name: "Partner", gueterstand: "communityOfProperty" },
      });

      expect(result).toHaveLength(3);
      expect(result).toEqual(
        containingShares([
          { name: "Partner", share: share(1, 4), order: 0 },
          { name: "Kind 1", share: share(3, 8), order: 1 },
          { name: "Kind 2", share: share(3, 8), order: 1 },
        ]),
      );
    });
  });

  describe("1st order — Kinder und Abkömmlinge", () => {
    // Test case 1: two living children
    it("two living children each inherit 1/2", () => {
      const result = calculateInheritance({
        hatteKinder: "yes",
        kinder: [
          { name: "Kind 1", isAlive: "yes" },
          { name: "Kind 2", isAlive: "yes" },
        ],
      });

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        containingShares([
          { name: "Kind 1", share: share(1, 2) },
          { name: "Kind 2", share: share(1, 2) },
        ]),
      );
    });

    // Test case 2: dead child passes share down (Repräsentationsprinzip)
    it("dead child's share passes to their descendants", () => {
      const result = calculateInheritance({
        hatteKinder: "yes",
        kinder: [
          { name: "Kind 1", isAlive: "yes" },
          {
            name: "Kind 2",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              { name: "Enkelkind 1", isAlive: "yes" },
              {
                name: "Enkelkind 2",
                isAlive: "no",
                hatteKinder: "yes",
                kinder: [
                  { name: "Urenkel 1", isAlive: "yes" },
                  { name: "Urenkel 2", isAlive: "yes" },
                ],
              },
            ],
          },
        ],
      });

      expect(result).toHaveLength(4);
      expect(result).toEqual(
        containingShares([
          { name: "Kind 1", share: share(1, 2) },
          { name: "Enkelkind 1", share: share(1, 4) },
          { name: "Urenkel 1", share: share(1, 8) },
          { name: "Urenkel 2", share: share(1, 8) },
        ]),
      );
    });

    it("extinct Stamm accretes to remaining living Stämme", () => {
      const result = calculateInheritance({
        hatteKinder: "yes",
        kinder: [
          { name: "Kind 1", isAlive: "yes" },
          { name: "Kind 2", isAlive: "no", hatteKinder: "no" }, // no descendants — extinct Stamm
          { name: "Kind 3", isAlive: "yes" },
        ],
      });

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        containingShares([
          { name: "Kind 1", share: share(1, 2) },
          { name: "Kind 3", share: share(1, 2) },
        ]),
      );
    });
  });

  describe("2nd order — Eltern und Abkömmlinge", () => {
    // Test case 3: no children at all
    it("falls to 2nd order when deceased had no children", () => {
      const result = calculateInheritance({
        hatteKinder: "no",
        elternteile: [
          { name: "Elternteil A", isAlive: "yes" },
          { name: "Elternteil B", isAlive: "yes" },
        ],
      });

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        containingShares([
          { name: "Elternteil A", share: share(1, 2) },
          { name: "Elternteil B", share: share(1, 2) },
        ]),
      );
    });

    // Test case 4: children exist but all dead with no descendants
    it("falls to 2nd order when all children are dead with no descendants", () => {
      const result = calculateInheritance({
        hatteKinder: "yes",
        kinder: [
          { name: "Kind 1", isAlive: "no", hatteKinder: "no" },
          { name: "Kind 2", isAlive: "no", hatteKinder: "no" },
        ],
        elternteile: [
          { name: "Elternteil A", isAlive: "yes" },
          { name: "Elternteil B", isAlive: "yes" },
        ],
      });

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        containingShares([
          { name: "Elternteil A", share: share(1, 2) },
          { name: "Elternteil B", share: share(1, 2) },
        ]),
      );
    });

    // Test case 5: one parent dead, share passes to their children
    it("dead parent's share passes to their children (Repräsentationsprinzip)", () => {
      const result = calculateInheritance({
        hatteKinder: "no",
        elternteile: [
          { name: "Elternteil A", isAlive: "yes" },
          {
            name: "Elternteil B",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              { name: "Kind 1 von B", isAlive: "yes" },
              {
                name: "Kind 2 von B",
                isAlive: "no",
                hatteKinder: "yes",
                kinder: [{ name: "Enkelkind 1 von B", isAlive: "yes" }],
              },
            ],
          },
        ],
      });

      expect(result).toHaveLength(3);
      expect(result).toEqual(
        containingShares([
          { name: "Elternteil A", share: share(1, 2) },
          { name: "Kind 1 von B", share: share(1, 4) },
          { name: "Enkelkind 1 von B", share: share(1, 4) },
        ]),
      );
    });

    // Test case 6: only one legal parent — their descendants inherit everything
    it("single parent's descendants inherit the full estate", () => {
      const result = calculateInheritance({
        hatteKinder: "no",
        elternteile: [
          {
            name: "Elternteil A",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              { name: "Kind 1 von A", isAlive: "yes" },
              {
                name: "Kind 2 von A",
                isAlive: "no",
                hatteKinder: "yes",
                kinder: [{ name: "Enkelkind 1 von A", isAlive: "yes" }],
              },
            ],
          },
        ],
      });

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        containingShares([
          { name: "Kind 1 von A", share: share(1, 2) },
          { name: "Enkelkind 1 von A", share: share(1, 2) },
        ]),
      );
    });

    // Deeper sibling levels (nieces/nephews) are re-bucketed by parentKindIndex, just
    // like the kinder line: the summary stores every new descendant under the first dead
    // sibling, and the select names the sibling they actually belong to.
    it("re-buckets a niece/nephew to the chosen sibling via parentKindIndex", () => {
      const result = calculateInheritance({
        hatteKinder: "no",
        elternteile: [
          {
            name: "Elternteil A",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              {
                name: "Geschwister 1",
                isAlive: "no",
                hatteKinder: "yes",
                kinder: [
                  { name: "Nichte X", isAlive: "yes", parentKindIndex: "0" },
                  { name: "Neffe Y", isAlive: "yes", parentKindIndex: "0" },
                  // physically stored under Geschwister 1, but belongs to Geschwister 2
                  { name: "Nichte Z", isAlive: "yes", parentKindIndex: "1" },
                ],
              },
              {
                name: "Geschwister 2",
                isAlive: "no",
                hatteKinder: "yes",
                kinder: [],
              },
            ],
          },
        ],
      });

      // Single parent → whole estate. Both Geschwister-Stämme active after reassignment
      // → 1/2 each. Geschwister 1: X, Y split 1/2 → 1/4 each. Geschwister 2: Z → 1/2.
      expect(result).toHaveLength(3);
      expect(result).toEqual(
        containingShares([
          { name: "Nichte X", share: share(1, 4) },
          { name: "Neffe Y", share: share(1, 4) },
          { name: "Nichte Z", share: share(1, 2) },
        ]),
      );
    });

    // Test case 7: both parents dead, full siblings (parentElternteilIndex "both")
    // accumulate shares from both parent lines.
    it("full siblings accumulate shares from both deceased parents", () => {
      const result = calculateInheritance({
        hatteKinder: "no",
        elternteile: [
          {
            name: "Elternteil A",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              { name: "Kind A1", isAlive: "yes" },
              { name: "Kind A2", isAlive: "yes" },
              {
                name: "Gemeinsames Kind 1",
                isAlive: "yes",
                parentElternteilIndex: "both",
              },
              {
                name: "Gemeinsames Kind 2",
                isAlive: "no",
                hatteKinder: "yes",
                parentElternteilIndex: "both",
                kinder: [
                  { name: "Gemeinsames Enkelkind 1", isAlive: "yes" },
                  { name: "Gemeinsames Enkelkind 2", isAlive: "yes" },
                ],
              },
            ],
          },
          {
            name: "Elternteil B",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [{ name: "Kind B1", isAlive: "yes" }],
          },
        ],
      });

      // Parent A: 4 children total (A1, A2, GK1, GK2) → each 1/8
      // Parent B: 3 children total (B1, GK1, GK2)    → each 1/6
      // Gemeinsames Kind 1: 1/8 + 1/6 = 7/24
      // Gemeinsames Kind 2 dead → Enkelkind 1 & 2: 1/16 (from A) + 1/12 (from B) = 7/48 each
      expect(result).toHaveLength(6);
      expect(result).toEqual(
        containingShares([
          { name: "Kind A1", share: share(1, 8) },
          { name: "Kind A2", share: share(1, 8) },
          { name: "Kind B1", share: share(1, 6) },
          { name: "Gemeinsames Kind 1", share: share(7, 24) },
          { name: "Gemeinsames Enkelkind 1", share: share(7, 48) },
          { name: "Gemeinsames Enkelkind 2", share: share(7, 48) },
        ]),
      );
    });

    it("counts a parentElternteilIndex='both' sibling in both parents' Stämme", () => {
      const result = calculateInheritance({
        hatteKinder: "no",
        elternteile: [
          {
            name: "Elternteil A",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              { name: "Kind A1", isAlive: "yes" },
              {
                name: "Vollgeschwister",
                isAlive: "yes",
                parentElternteilIndex: "both",
              },
            ],
          },
          {
            name: "Elternteil B",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [{ name: "Kind B1", isAlive: "yes" }],
          },
        ],
      });

      // Each parent's half (1/2) split among 2 children:
      // A: A1 + Vollgeschwister → each 1/4; B: B1 + Vollgeschwister → each 1/4
      // Vollgeschwister: 1/4 + 1/4 = 1/2
      expect(result).toEqual(
        containingShares([
          { name: "Kind A1", share: share(1, 4) },
          { name: "Kind B1", share: share(1, 4) },
          { name: "Vollgeschwister", share: share(1, 2) },
        ]),
      );
    });

    // Degenerate variant of test case 7: the deceased parents have no unshared
    // children — the full sibling is the sole heir (1/2 from each parent's line).
    it("full sibling inherits everything when both dead parents have only shared children", () => {
      const result = calculateInheritance({
        hatteKinder: "no",
        elternteile: [
          {
            name: "Elternteil A",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              {
                name: "Vollgeschwister",
                isAlive: "yes",
                parentElternteilIndex: "both",
              },
            ],
          },
          { name: "Elternteil B", isAlive: "no", hatteKinder: "yes" },
        ],
      });

      expect(result).toEqual(
        containingShares([{ name: "Vollgeschwister", share: share(1, 1) }]),
      );
      expect(result).toHaveLength(1);
    });

    // 1st-order descendants are physically stored under the first dead parent of the
    // previous level; `parentKindIndex` names the parent they actually belong to.
    it("places a grandchild by parentKindIndex, not its physical parent array", () => {
      const result = calculateInheritance({
        hatteKinder: "yes",
        kinder: [
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
          { name: "Kind 3", isAlive: "yes" },
        ] as InheritanceInput["kinder"],
      });

      // Three active Stämme: Kind 1 (→ Enkelkind 1), Kind 2 (→ Enkelkind 2), Kind 3
      expect(result).toEqual(
        containingShares([
          { name: "Kind 3", share: share(1, 3), depth: 1 },
          { name: "Enkelkind 1", share: share(1, 3), depth: 2 },
          { name: "Enkelkind 2", share: share(1, 3), depth: 2 },
        ]),
      );
      expect(result).toHaveLength(3);
    });

    it("re-buckets deeper descendants among their own physical sibling array", () => {
      const result = calculateInheritance({
        hatteKinder: "yes",
        kinder: [
          {
            name: "Kind 1",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              {
                name: "Enkelkind 1",
                isAlive: "no",
                hatteKinder: "yes",
                kinder: [
                  { name: "Urenkel 1", isAlive: "yes", parentKindIndex: "0" },
                  { name: "Urenkel 2", isAlive: "yes", parentKindIndex: "1" },
                ],
              },
              { name: "Enkelkind 2", isAlive: "no", hatteKinder: "yes" },
              { name: "Enkelkind 3", isAlive: "yes" },
            ],
          },
        ] as InheritanceInput["kinder"],
      });

      // Kind 1's Stamm splits into three: Enkelkind 1 (→ Urenkel 1),
      // Enkelkind 2 (→ Urenkel 2), Enkelkind 3
      expect(result).toEqual(
        containingShares([
          { name: "Enkelkind 3", share: share(1, 3), depth: 2 },
          { name: "Urenkel 1", share: share(1, 3), depth: 3 },
          { name: "Urenkel 2", share: share(1, 3), depth: 3 },
        ]),
      );
      expect(result).toHaveLength(3);
    });

    // Stale-data guard: a sibling can stay assigned to a parent who was later
    // edited back to alive. The assignment must fall back to the physical parent
    // instead of silently dropping the sibling from the distribution.
    it("falls back to the physical parent when the assigned parent is alive", () => {
      const result = calculateInheritance({
        hatteKinder: "no",
        elternteile: [
          {
            name: "Elternteil A",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              {
                name: "Geschwister",
                isAlive: "yes",
                parentElternteilIndex: "1",
              },
            ],
          },
          { name: "Elternteil B", isAlive: "yes" },
        ],
      });

      expect(result).toEqual(
        containingShares([
          { name: "Elternteil B", share: share(1, 2) },
          { name: "Geschwister", share: share(1, 2) },
        ]),
      );
      expect(result).toHaveLength(2);
    });

    it("places a sibling by parentElternteilIndex, not its physical parent array", () => {
      const result = calculateInheritance({
        hatteKinder: "no",
        elternteile: [
          {
            name: "Elternteil A",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              { name: "Kind A1", isAlive: "yes" },
              {
                name: "Kind von B",
                isAlive: "yes",
                parentElternteilIndex: "1",
              },
            ],
          },
          { name: "Elternteil B", isAlive: "no", hatteKinder: "no" },
        ],
      });

      // A's line: only A1 → 1/2; B's line: only "Kind von B" → 1/2
      expect(result).toEqual(
        containingShares([
          { name: "Kind A1", share: share(1, 2) },
          { name: "Kind von B", share: share(1, 2) },
        ]),
      );
    });
  });
});
