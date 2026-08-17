import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type NachlassErbfolgePages } from "./pages";
import { kinderRequireFurtherGenerations } from "../shared/calculateInheritance";
import { collectMissingChildrenNames } from "../shared/missingChildren";
import {
  allDescendantsDead,
  getEligibleKind,
} from "~/domains/nachlass/erbschein/shared/erbfolgeHelpers";

export const kinderFlowConfig = {
  kind1Summary: [
    { target: "kind1Daten", type: "addArrayItem" },
    {
      // Checked first: a depth-5 dead person with hatteKinder="yes" can never
      // have kinder filled in (no depth-6 UI exists), so it would otherwise
      // always look like a "missing children" case below.
      target: "nichtErmitteltWeitereGenerationen",
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
      target: "elternteilSummary",
      guard: ({ kinder }) =>
        !!kinder && kinder.length > 0 && kinder.every(allDescendantsDead),
    },
    { target: "ergebnis" },
  ],
  kind1Daten: [
    {
      target: "kind1HatteKinder",
      guard: ({ kinder, pageData }) =>
        getEligibleKind(kinder, pageData?.arrayIndexes, 1)?.isAlive === "no",
    },
    { target: "kind1Summary", guard: () => true },
  ],
  kind1HatteKinder: [
    {
      target: "kind2Daten",
      type: "addArrayItem",
      guard: ({ kinder, pageData }) => {
        const kind = getEligibleKind(kinder, pageData?.arrayIndexes, 1);
        return kind?.isAlive === "no" && kind.hatteKinder === "yes";
      },
    },
    { target: "kind1Summary", guard: () => true },
  ],
  kind2Daten: [
    {
      target: "kind2HatteKinder",
      guard: ({ kinder, pageData }) =>
        getEligibleKind(kinder, pageData?.arrayIndexes, 2)?.isAlive === "no",
    },
    { target: "kind1Summary", guard: () => true },
  ],
  kind2HatteKinder: [
    {
      target: "kind3Daten",
      type: "addArrayItem",
      guard: ({ kinder, pageData }) => {
        const kind = getEligibleKind(kinder, pageData?.arrayIndexes, 2);
        return kind?.isAlive === "no" && kind.hatteKinder === "yes";
      },
    },
    { target: "kind1Summary", guard: () => true },
  ],
  kind3Daten: [
    {
      target: "kind3HatteKinder",
      guard: ({ kinder, pageData }) =>
        getEligibleKind(kinder, pageData?.arrayIndexes, 3)?.isAlive === "no",
    },
    { target: "kind1Summary", guard: () => true },
  ],
  kind3HatteKinder: [
    {
      target: "kind4Daten",
      type: "addArrayItem",
      guard: ({ kinder, pageData }) => {
        const kind = getEligibleKind(kinder, pageData?.arrayIndexes, 3);
        return kind?.isAlive === "no" && kind.hatteKinder === "yes";
      },
    },
    { target: "kind1Summary", guard: () => true },
  ],
  kind4Daten: [
    {
      target: "kind4HatteKinder",
      guard: ({ kinder, pageData }) =>
        getEligibleKind(kinder, pageData?.arrayIndexes, 4)?.isAlive === "no",
    },
    { target: "kind1Summary", guard: () => true },
  ],
  kind4HatteKinder: [
    {
      target: "kind5Daten",
      type: "addArrayItem",
      guard: ({ kinder, pageData }) => {
        const kind = getEligibleKind(kinder, pageData?.arrayIndexes, 4);
        return kind?.isAlive === "no" && kind.hatteKinder === "yes";
      },
    },
    { target: "kind1Summary", guard: () => true },
  ],
  kind5Daten: [
    {
      target: "kind5HatteKinder",
      guard: ({ kinder, pageData }) =>
        getEligibleKind(kinder, pageData?.arrayIndexes, 5)?.isAlive === "no",
    },
    { target: "kind1Summary", guard: () => true },
  ],
  kind5HatteKinder: [
    {
      target: "nichtErmitteltWeitereGenerationen",
      guard: ({ kinder, pageData }) => {
        const kind = getEligibleKind(kinder, pageData?.arrayIndexes, 5);
        return kind?.isAlive === "no" && kind.hatteKinder === "yes";
      },
    },
    { target: "kind1Summary", guard: () => true },
  ],
} satisfies Partial<TransitionConfigMap<NachlassErbfolgePages>>;
