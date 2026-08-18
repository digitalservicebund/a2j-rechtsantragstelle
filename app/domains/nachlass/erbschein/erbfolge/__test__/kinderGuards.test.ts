import { kinderFlowConfig } from "~/domains/nachlass/erbschein/anfrage/angehoerige/kinder/kinderFlowConfig";
import { type NachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { type Kind } from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";
import {
  evaluateAllBranches,
  evaluateRoute,
} from "~/services/flow/newFlowEngine/routing";
import { type InferredUserData } from "~/services/flow/newFlowEngine/types";

type GuardData = InferredUserData<NachlassErbscheinAnfragePages>;

const kindAtDepth = (depth: number, livingAncestorAt?: number): Kind[] => {
  let kind = {
    isAlive: "no",
    hatteKinder: "yes",
    kinder: [],
  } as unknown as Kind;

  for (let level = depth - 1; level >= 0; level--) {
    kind = {
      isAlive: level === livingAncestorAt ? "yes" : "no",
      hatteKinder: "yes",
      kinder: [kind],
    } as Kind;
  }

  return [kind];
};

const guardData = (depth: number, livingAncestorAt?: number): GuardData => ({
  kinder: kindAtDepth(depth, livingAncestorAt),
  pageData: { arrayIndexes: Array(depth).fill(0) },
});

const route = (key: keyof typeof kinderFlowConfig) => kinderFlowConfig[key];

describe("Erbscheinsantrag child flow guards", () => {
  it.each([1, 2, 3, 4, 5] as const)(
    "routes a deceased child at depth %i to its death-date page",
    (depth) => {
      expect(
        evaluateRoute(route(`kind${depth}IsAlive`), guardData(depth)),
      ).toBe(`kind${depth}Sterbedatum`);
    },
  );

  it.each([1, 2, 3, 4, 5] as const)(
    "allows adding a descendant from a deceased child with children at depth %i",
    (depth) => {
      const expectedTarget =
        depth === 5 ? "angehoerigeOverview" : `kind${depth + 1}Name`;

      expect(
        evaluateAllBranches(route(`kind${depth}HatteKinder`), guardData(depth)),
      ).toContain(expectedTarget);
    },
  );

  it.each([2, 3, 4, 5] as const)(
    "rejects a depth-%i route when an ancestor is alive",
    (depth) => {
      const data = guardData(depth, depth - 2);

      expect(evaluateRoute(route(`kind${depth}IsAlive`), data)).toBe(
        `kind${depth}Address`,
      );
      expect(
        evaluateAllBranches(route(`kind${depth}HatteKinder`), data),
      ).not.toContain(
        depth === 5 ? "angehoerigeOverview" : `kind${depth + 1}Name`,
      );
    },
  );
});
