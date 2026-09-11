import {
  type InferredUserData,
  type TransitionConfigMap,
} from "~/services/flow/newFlowEngine/types";
import {
  allDescendantsDead,
  getEligibleKind,
  hasMissingDataInFamily,
  kinderRequireFurtherGenerations,
} from "~/domains/nachlass/erbschein/shared/erbfolgeHelpers";
import { collectMissingChildrenNames } from "~/domains/nachlass/erbschein/shared/missingChildren";
import { type ErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { MAX_SUPPORTED_DESCENDANT_DEPTH } from "~/domains/nachlass/erbschein/shared/erbfolgeHelpers";

type KinderLevelPageConfigs<D extends number> = Record<
  `kind${D}Name`,
  TransitionConfigMap<ErbscheinAnfragePages>[keyof TransitionConfigMap<ErbscheinAnfragePages>]
> &
  Record<
    `kind${D}Geburtsdatum`,
    TransitionConfigMap<ErbscheinAnfragePages>[keyof TransitionConfigMap<ErbscheinAnfragePages>]
  > &
  Record<
    `kind${D}IsAlive`,
    TransitionConfigMap<ErbscheinAnfragePages>[keyof TransitionConfigMap<ErbscheinAnfragePages>]
  > &
  Record<
    `kind${D}Address`,
    TransitionConfigMap<ErbscheinAnfragePages>[keyof TransitionConfigMap<ErbscheinAnfragePages>]
  > &
  Record<
    `kind${D}Sterbedatum`,
    TransitionConfigMap<ErbscheinAnfragePages>[keyof TransitionConfigMap<ErbscheinAnfragePages>]
  > &
  Record<
    `kind${D}HatteKinder`,
    TransitionConfigMap<ErbscheinAnfragePages>[keyof TransitionConfigMap<ErbscheinAnfragePages>]
  >;

const kinderGuard = (
  guard: (data: InferredUserData<ErbscheinAnfragePages>) => boolean,
) => guard;

const kinderLevelTransitionConfigs = <D extends number>(depth: D) => {
  return {
    [`kind${depth}Name`]: `kind${depth}Geburtsdatum`,
    [`kind${depth}Geburtsdatum`]: `kind${depth}IsAlive`,
    [`kind${depth}IsAlive`]: [
      {
        guard: kinderGuard(
          ({ kinder, pageData }) =>
            getEligibleKind(kinder, pageData?.arrayIndexes, depth)?.isAlive ===
            "no",
        ),
        target: `kind${depth}Sterbedatum`,
      },
      {
        target: `kind${depth}Address`,
      },
    ],
    [`kind${depth}Address`]: `kindSummary`,
    [`kind${depth}Sterbedatum`]: `kind${depth}HatteKinder`,
    [`kind${depth}HatteKinder`]: [
      {
        ...(depth >= MAX_SUPPORTED_DESCENDANT_DEPTH
          ? // No deeper array level exists here, and evaluateRoute ignores guards
            // on addArrayItem, so the depth limit must be a plain transition.
            { target: "angehoerigeOverview" }
          : { target: `kind${depth + 1}Name`, type: "addArrayItem" }),
        guard: kinderGuard(({ kinder, pageData }) => {
          const kind = getEligibleKind(kinder, pageData?.arrayIndexes, depth);
          return kind?.isAlive === "no" && kind.hatteKinder === "yes";
        }),
      },
      { target: `kindSummary` },
    ],
  } as KinderLevelPageConfigs<D>;
};

export const kinderFlowConfig = {
  hatteKinder: [
    {
      guard: ({ hatteKinder }) => hatteKinder === "yes",
      target: "kindSummary",
    },
    {
      target: "elternteilSummary",
    },
  ],
  kinderFehlen: null,
  kindSummary: [
    { target: "kind1Name", type: "addArrayItem" },
    {
      // Checked first: a depth-5 dead person with hatteKinder="yes" can never
      // have kinder filled in (no depth-6 UI exists), so it would otherwise
      // always look like a "missing children" case below.
      target: "angehoerigeOverview",
      guard: kinderRequireFurtherGenerations,
    },
    {
      // Wrapping the deceased as the root of the tree catches both shapes at
      // once: hatteKinder="yes" with an empty kinder array (nobody added at
      // all), and any individual kind further down with the same problem.
      target: "kinderFehlen",
      guard: ({
        verstorbeneVorname,
        verstorbeneNachname,
        hatteKinder,
        kinder,
      }) =>
        collectMissingChildrenNames([
          {
            vorname: verstorbeneVorname,
            nachname: verstorbeneNachname,
            isAlive: "no",
            hatteKinder,
            kinder,
          },
        ]).length > 0 || hasMissingDataInFamily(kinder),
    },
    {
      target: "elternteilSummary",
      guard: ({ kinder }) =>
        !!kinder && kinder.length > 0 && kinder.every(allDescendantsDead),
    },
    { target: "grundbesitz" },
  ],
  ...kinderLevelTransitionConfigs(1),
  ...kinderLevelTransitionConfigs(2),
  ...kinderLevelTransitionConfigs(3),
  ...kinderLevelTransitionConfigs(4),
  ...kinderLevelTransitionConfigs(5),
} satisfies Partial<TransitionConfigMap<ErbscheinAnfragePages>>;
