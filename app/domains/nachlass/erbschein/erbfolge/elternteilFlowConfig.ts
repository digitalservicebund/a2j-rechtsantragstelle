import {
  type InferredUserData,
  type NodeKey,
  type TransitionConfig,
  type TransitionConfigMap,
} from "~/services/flow/newFlowEngine/types";
import { type PageData } from "~/services/flow/pageDataSchema";
import { type NachlassErbfolgePages } from "./pages";

type GuardData = InferredUserData<NachlassErbfolgePages> & {
  pageData: PageData;
};
type NodeKeys = NodeKey<NachlassErbfolgePages>;

type DescendantNode = {
  isAlive?: string;
  hatteKinder?: string;
  kinder?: DescendantNode[];
};

// Walk elternteile[i0].kinder[i1]…kinder[iDepth] and return the node at `depth`
// (0 = the parent itself, 1 = a sibling, …) only if every ancestor is a dead
// parent-with-kids; otherwise null. arrayIndexes = [elternteilIndex, kind1Index, …].
function elternteilKindAt(
  elternteile: DescendantNode[] | undefined,
  arrayIndexes: number[] | undefined,
  depth: number,
): DescendantNode | null {
  if (!elternteile || !arrayIndexes || arrayIndexes.length < depth + 1)
    return null;
  let node: DescendantNode | undefined = elternteile[arrayIndexes[0]];
  for (let level = 1; level <= depth; level++) {
    if (!node || node.isAlive !== "no" || node.hatteKinder !== "yes")
      return null;
    node = node.kinder?.[arrayIndexes[level]];
  }
  return node ?? null;
}

const isDead = (node: DescendantNode | null) => node?.isAlive === "no";
const isDeadWithKinder = (node: DescendantNode | null) =>
  node?.isAlive === "no" && node?.hatteKinder === "yes";

// The daten / hatteKinder / kinderAnzahl transitions for one sibling depth (1–4).
// Same shape as the kinder line: descend while each node is a dead parent-with-kids,
// otherwise fall back to the overview. Template-literal key types keep the keys known.
const elternteilKindLevelTransitions = <Depth extends number>(depth: Depth) => {
  const hatteKinderTarget = `elternteilKind${depth}HatteKinder` as NodeKeys;
  const kinderAnzahlTarget = `elternteilKind${depth}KinderAnzahl` as NodeKeys;
  const nextDatenTarget = `elternteilKind${depth + 1}Daten` as NodeKeys;

  const entries = {
    [`elternteilKind${depth}Daten`]: [
      {
        target: hatteKinderTarget,
        guard: ({ elternteile, pageData: { arrayIndexes } }: GuardData) =>
          isDead(elternteilKindAt(elternteile, arrayIndexes, depth)),
      },
      { target: "elternteilSummary", guard: () => true },
    ],
    [`elternteilKind${depth}HatteKinder`]: [
      {
        target: kinderAnzahlTarget,
        guard: ({ elternteile, pageData: { arrayIndexes } }: GuardData) =>
          isDeadWithKinder(elternteilKindAt(elternteile, arrayIndexes, depth)),
      },
      { target: "elternteilSummary", guard: () => true },
    ],
    [`elternteilKind${depth}KinderAnzahl`]: [
      { target: nextDatenTarget, type: "addArrayItem" },
      { target: "elternteilSummary" },
    ],
  };

  return entries as Record<
    | `elternteilKind${Depth}Daten`
    | `elternteilKind${Depth}HatteKinder`
    | `elternteilKind${Depth}KinderAnzahl`,
    TransitionConfig<NodeKeys, GuardData>
  >;
};

export const elternteilFlowConfig = {
  elternteilDaten: [
    {
      target: "elternteilHatteKinder",
      guard: ({ elternteile, pageData: { arrayIndexes } }) =>
        isDead(elternteilKindAt(elternteile, arrayIndexes, 0)),
    },
    { target: "elternteilSummary", guard: () => true },
  ],
  elternteilHatteKinder: [
    {
      target: "elternteilKinderAnzahl",
      guard: ({ elternteile, pageData: { arrayIndexes } }) =>
        isDeadWithKinder(elternteilKindAt(elternteile, arrayIndexes, 0)),
    },
    { target: "elternteilSummary", guard: () => true },
  ],
  elternteilKinderAnzahl: [
    { target: "elternteilKind1Daten", type: "addArrayItem" },
    { target: "elternteilSummary" },
  ],
  ...elternteilKindLevelTransitions(1),
  ...elternteilKindLevelTransitions(2),
  ...elternteilKindLevelTransitions(3),
  ...elternteilKindLevelTransitions(4),
  // Deepest level loops back to the overview.
  elternteilKind5Daten: "elternteilSummary",
} satisfies Partial<TransitionConfigMap<NachlassErbfolgePages>>;
