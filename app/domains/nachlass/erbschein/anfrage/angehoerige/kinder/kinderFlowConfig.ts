import {
  type InferredUserData,
  type TransitionConfigMap,
} from "~/services/flow/newFlowEngine/types";
import {
  allDescendantsDead,
  getEligibleKind,
} from "~/domains/nachlass/erbschein/shared/erbfolgeHelpers";
import { collectMissingChildrenNames } from "~/domains/nachlass/erbschein/shared/missingChildren";
import { type NachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import {
  kinderRequireFurtherGenerations,
  MAX_SUPPORTED_DESCENDANT_DEPTH,
} from "~/domains/nachlass/erbschein/shared/calculateInheritance";

type KinderLevelPageConfigs<D extends number> = Record<
  `kind${D}Name`,
  TransitionConfigMap<NachlassErbscheinAnfragePages>[keyof TransitionConfigMap<NachlassErbscheinAnfragePages>]
> &
  Record<
    `kind${D}Geburtsdatum`,
    TransitionConfigMap<NachlassErbscheinAnfragePages>[keyof TransitionConfigMap<NachlassErbscheinAnfragePages>]
  > &
  Record<
    `kind${D}IsAlive`,
    TransitionConfigMap<NachlassErbscheinAnfragePages>[keyof TransitionConfigMap<NachlassErbscheinAnfragePages>]
  > &
  Record<
    `kind${D}Address`,
    TransitionConfigMap<NachlassErbscheinAnfragePages>[keyof TransitionConfigMap<NachlassErbscheinAnfragePages>]
  > &
  Record<
    `kind${D}Sterbedatum`,
    TransitionConfigMap<NachlassErbscheinAnfragePages>[keyof TransitionConfigMap<NachlassErbscheinAnfragePages>]
  > &
  Record<
    `kind${D}HatteKinder`,
    TransitionConfigMap<NachlassErbscheinAnfragePages>[keyof TransitionConfigMap<NachlassErbscheinAnfragePages>]
  >;

const kinderGuard = (
  guard: (data: InferredUserData<NachlassErbscheinAnfragePages>) => boolean,
) => guard;

const kinderLevelPageConfigs = <D extends number>(depth: D) => {
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
    [`kind${depth}Address`]: `kind${depth}Summary`,
    [`kind${depth}Sterbedatum`]: `kind${depth}HatteKinder`,
    [`kind${depth}HatteKinder`]: [
      {
        target:
          depth >= MAX_SUPPORTED_DESCENDANT_DEPTH
            ? "angehoerigeOverview"
            : `kind${depth + 1}Name`,
        type: "addArrayItem",
        guard: kinderGuard(({ kinder, pageData }) => {
          const kind = getEligibleKind(kinder, pageData?.arrayIndexes, depth);
          return kind?.isAlive === "no" && kind.hatteKinder === "yes";
        }),
      },
      { target: `kind1Summary`, guard: () => true },
    ],
  } as KinderLevelPageConfigs<D>;
};

export const kinderFlowConfig = {
  hatteKinder: [
    {
      guard: ({ hatteKinder }) => hatteKinder === "yes",
      target: "kind1Summary",
    },
    {
      target: "grundbesitz",
    },
  ],
  kinderFehlen: null,
  kind1Summary: [
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
        ]).length > 0,
    },
    {
      target: null, // FIXME: redirect to elternteil summary page
      guard: ({ kinder }) =>
        !!kinder && kinder.length > 0 && kinder.every(allDescendantsDead),
    },
    { target: "grundbesitz" },
  ],
  ...kinderLevelPageConfigs(1),
  ...kinderLevelPageConfigs(2),
  ...kinderLevelPageConfigs(3),
  ...kinderLevelPageConfigs(4),
  ...kinderLevelPageConfigs(5),
} satisfies Partial<TransitionConfigMap<NachlassErbscheinAnfragePages>>;
