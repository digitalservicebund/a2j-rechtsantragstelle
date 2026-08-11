import { compileFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { nachlassErbfolgePages } from "./pages";
import { kinderFlowConfig } from "./kinderFlowConfig";
import { elternteilFlowConfig } from "./elternteilFlowConfig";
import {
  elternteileRequireFurtherGenerations,
  hasNoFirstOrSecondOrderHeirs,
} from "./calculateInheritance";
import { collectMissingChildrenNamesForElternteile } from "../shared/missingChildren";

export const nachlassErbfolgeStaticFlow = compileFlow({
  pages: nachlassErbfolgePages,
  initialStep: "start",
  transitions: {
    start: "testamentOderErbvertrag",
    // A will or inheritance contract overrides the statutory succession this flow
    // determines, so any "yes" exits to the "keine gesetzliche Erbfolge" page.
    testamentOderErbvertrag: [
      {
        target: "keineGesetzlicheErbfolge",
        guard: (d) =>
          d.testamentArt === "handwritten" ||
          d.testamentArt === "notarized" ||
          d.testamentArt === "erbvertrag",
      },
      { target: "verstorbenePerson" },
    ],
    verstorbenePerson: "familienstand",
    familienstand: [
      { target: "ehepartner", guard: (d) => d.familienstand === "verheiratet" },
      { target: "kinder" },
    ],
    ehepartner: "ehepartnerStaatsangehoerigkeit",
    ehepartnerStaatsangehoerigkeit: [
      {
        target: "inDeutschlandGeheiratet",
        guard: (d) => d.ehepartnerStaatsangehoerigkeit === "nurDeutsch",
      },
      { target: "auslandsbezug" },
    ],
    auslandsbezug: null,
    inDeutschlandGeheiratet: [
      {
        target: "ehevertrag",
        guard: (d) => d.inDeutschlandGeheiratet === "yes",
      },
      { target: "auslandsbezug" },
    ],
    ehevertrag: [
      { target: "gueterstand", guard: (d) => d.ehevertrag === "yes" },
      { target: "kinder" },
    ],
    gueterstand: "kinder",
    kinder: [
      { target: "kind1Summary", guard: (d) => d.hatteKinder === "yes" },
      { target: "elternteilSummary" },
    ],
    ...kinderFlowConfig,
    elternteilSummary: [
      { target: "elternteilDaten", type: "addArrayItem" },
      {
        // Checked first: a depth-5 dead person with hatteKinder="yes" can
        // never have kinder filled in (no depth-6 UI exists), so it would
        // otherwise always look like a "missing children" case below.
        target: "nichtErmitteltWeitereGenerationen",
        guard: elternteileRequireFurtherGenerations,
      },
      {
        target: "kinderFehlen",
        guard: ({ elternteile }) =>
          collectMissingChildrenNamesForElternteile(elternteile ?? []).length >
          0,
      },
      {
        target: "grosseltern",
        guard: (d) =>
          !!(d.ehepartnerVorname || d.ehepartnerNachname) &&
          hasNoFirstOrSecondOrderHeirs(d),
      },
      {
        target: "nichtErmitteltWeitereOrdnungen",
        guard: hasNoFirstOrSecondOrderHeirs,
      },
      { target: "ergebnis" },
    ],
    ...elternteilFlowConfig,
    grosseltern: [
      {
        target: "nichtErmitteltWeitereOrdnungen",
        guard: (d) => d.grosselternLeben === "yes",
      },
      { target: "ergebnis" },
    ],
    ergebnis: null,
    nichtErmitteltWeitereGenerationen: null,
    nichtErmitteltWeitereOrdnungen: null,
    kinderFehlen: null,
    keineGesetzlicheErbfolge: null,
  },
});
