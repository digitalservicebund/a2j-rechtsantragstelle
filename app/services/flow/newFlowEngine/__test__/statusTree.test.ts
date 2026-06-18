import {
  buildStatusTree,
  type StatusSimulationResult,
} from "../statusTree";

const simulation = (): StatusSimulationResult => ({
  path: [],
  reachableSet: new Set(),
  isComplete: false,
});

describe("buildStatusTree", () => {
  describe("section ordering", () => {
    it("preserves flow-definition order of sibling sections regardless of name length", () => {
      const config = {
        gegenWen: { stepId: "/gericht-pruefen/gegen-wen" },
        kaufmann: { stepId: "/klage-erstellen/kaufmann" },
      };
      const tree = buildStatusTree(config, simulation());
      expect(Object.keys(tree)).toEqual([
        "/gericht-pruefen",
        "/klage-erstellen",
      ]);
    });

    it("inserts parent sections before their nested children", () => {
      const config = {
        kaufmann: { stepId: "/klage-erstellen/kaufmann" },
        gegenWen: { stepId: "/gericht-pruefen/gegen-wen" },
        kaufmannAbbruch: {
          stepId: "/klage-erstellen/kaufmann/ergebnis/abbruch",
        },
      };
      const tree = buildStatusTree(config, simulation());
      expect(Object.keys(tree)).toEqual([
        "/klage-erstellen",
        "/gericht-pruefen",
      ]);
      expect(Object.keys(tree["/klage-erstellen"].children ?? {})).toEqual([
        "/kaufmann",
      ]);
    });

    it("orders by nesting depth, not string length, so a deeply nested short name does not jump ahead of a shallow long-named sibling", () => {
      const config = {
        kaufmann: { stepId: "/klage-erstellen/kaufmann/ergebnis/abbruch" },
        gegenWen: { stepId: "/gericht-pruefen/gegen-wen" },
      };
      const tree = buildStatusTree(config, simulation());
      expect(Object.keys(tree)).toEqual([
        "/klage-erstellen",
        "/gericht-pruefen",
      ]);
      expect(Object.keys(tree["/klage-erstellen"].children ?? {})).toEqual([
        "/kaufmann",
      ]);
    });

    it("preserves child order within a nested section", () => {
      const config = {
        gegenWen: { stepId: "/gericht-pruefen/gegen-wen/start" },
        kaufmann: { stepId: "/gericht-pruefen/kaufmann/start" },
        postleitzahl: {
          stepId: "/gericht-pruefen/postleitzahl-beklagte-person/start",
        },
      };
      const tree = buildStatusTree(config, simulation());
      expect(Object.keys(tree["/gericht-pruefen"].children ?? {})).toEqual([
        "/gegen-wen",
        "/kaufmann",
        "/postleitzahl-beklagte-person",
      ]);
    });
  });
});
