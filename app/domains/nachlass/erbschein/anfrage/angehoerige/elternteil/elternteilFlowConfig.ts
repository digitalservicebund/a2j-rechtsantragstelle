import { type NachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { MAX_SUPPORTED_DESCENDANT_DEPTH } from "~/domains/nachlass/erbschein/shared/calculateInheritance";
import {
  type InferredUserData,
  type TransitionConfigMap,
} from "~/services/flow/newFlowEngine/types";

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
    if (node?.isAlive !== "no" || node.hatteKinder !== "yes") return null;
    node = node.kinder?.[arrayIndexes[level]];
  }
  return node ?? null;
}

const _isDead = (node: DescendantNode | null) => node?.isAlive === "no";
const _isDeadWithKinder = (node: DescendantNode | null) =>
  node?.isAlive === "no" && node?.hatteKinder === "yes";

type ElternteilKindLevelPageConfigs<D extends number> = Record<
  `elternteilKind${D}Name`,
  TransitionConfigMap<NachlassErbscheinAnfragePages>[keyof TransitionConfigMap<NachlassErbscheinAnfragePages>]
> &
  Record<
    `elternteilKind${D}Geburtsdatum`,
    TransitionConfigMap<NachlassErbscheinAnfragePages>[keyof TransitionConfigMap<NachlassErbscheinAnfragePages>]
  > &
  Record<
    `elternteilKind${D}IsAlive`,
    TransitionConfigMap<NachlassErbscheinAnfragePages>[keyof TransitionConfigMap<NachlassErbscheinAnfragePages>]
  > &
  Record<
    `elternteilKind${D}Address`,
    TransitionConfigMap<NachlassErbscheinAnfragePages>[keyof TransitionConfigMap<NachlassErbscheinAnfragePages>]
  > &
  Record<
    `elternteilKind${D}Sterbedatum`,
    TransitionConfigMap<NachlassErbscheinAnfragePages>[keyof TransitionConfigMap<NachlassErbscheinAnfragePages>]
  > &
  Record<
    `elternteilKind${D}HatteKinder`,
    TransitionConfigMap<NachlassErbscheinAnfragePages>[keyof TransitionConfigMap<NachlassErbscheinAnfragePages>]
  >;

const elternteilKindGuard = (
  guard: (data: InferredUserData<NachlassErbscheinAnfragePages>) => boolean,
) => guard;

// The daten / hatteKinder transitions for one sibling depth (1–4).
// Same shape as the kinder line: descend while each node is a dead parent-with-kids,
// otherwise fall back to the overview. Template-literal key types keep the keys known.
const elternteilKindLevelPageConfigs = <Depth extends number>(depth: Depth) => {
  return {
    [`elternteilKind${depth}Name`]: `elternteilKind${depth}Geburtsdatum`,
    [`elternteilKind${depth}Geburtsdatum`]: `elternteilKind${depth}IsAlive`,
    [`elternteilKind${depth}IsAlive`]: [
      {
        guard: elternteilKindGuard(
          ({ elternteile, pageData }) =>
            elternteilKindAt(elternteile, pageData?.arrayIndexes, depth)
              ?.isAlive === "no",
        ),
        target: `elternteilKind${depth}Sterbedatum`,
      },
      {
        target: `elternteilKind${depth}Address`,
      },
    ],
    [`elternteilKind${depth}Address`]: `elternteilSummary`,
    [`elternteilKind${depth}Sterbedatum`]: `elternteilKind${depth}HatteKinder`,
    [`elternteilKind${depth}HatteKinder`]: [
      {
        ...(depth >= MAX_SUPPORTED_DESCENDANT_DEPTH
          ? // No deeper array level exists here, and evaluateRoute ignores guards
            // on addArrayItem, so the depth limit must be a plain transition.
            { target: "angehoerigeOverview" }
          : { target: `elternteilKind${depth + 1}Name`, type: "addArrayItem" }),
        guard: elternteilKindGuard(({ elternteile, pageData }) => {
          const kind = elternteilKindAt(
            elternteile,
            pageData?.arrayIndexes,
            depth,
          );
          return kind?.isAlive === "no" && kind.hatteKinder === "yes";
        }),
      },
      { target: `elternteilSummary` },
    ],
  } as ElternteilKindLevelPageConfigs<Depth>;
};

export const elternteilFlowConfig = {
  elternteilSummary: null,
  elternteilName: null,
  elternteilGeburtsdatum: null,
  elternteilIsAlive: null,
  elternteilAddress: null,
  elternteilSterbedatum: null,
  elternteilHatteKinder: null,
  ...elternteilKindLevelPageConfigs(1),
  ...elternteilKindLevelPageConfigs(2),
  ...elternteilKindLevelPageConfigs(3),
  ...elternteilKindLevelPageConfigs(4),
  ...elternteilKindLevelPageConfigs(5),
} satisfies Partial<TransitionConfigMap<NachlassErbscheinAnfragePages>>;
