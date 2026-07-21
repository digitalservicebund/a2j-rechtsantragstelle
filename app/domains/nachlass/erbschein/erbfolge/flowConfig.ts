import { compileFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { nachlassErbfolgePages } from "./pages";
import { kinderFlowConfig } from "./kinderFlowConfig";
import { elternteilFlowConfig } from "./elternteilFlowConfig";
import {
  hasNoFirstOrSecondOrderHeirs,
  requiresFurtherGenerations,
} from "./calculateInheritance";

export const nachlassErbfolgeStaticFlow = compileFlow({
  pages: nachlassErbfolgePages,
  initialStep: "start",
  transitions: {
    start: "verstorbenePerson",
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
        target: "nichtErmitteltWeitereOrdnungen",
        guard: requiresFurtherGenerations,
      },
      {
        target: "nichtErmitteltWeitereGenerationen",
        guard: hasNoFirstOrSecondOrderHeirs,
      },
      { target: "ergebnis" },
    ],
    ...elternteilFlowConfig,
    ergebnis: null,
    nichtErmitteltWeitereGenerationen: null,
    nichtErmitteltWeitereOrdnungen: null,
  },
});
