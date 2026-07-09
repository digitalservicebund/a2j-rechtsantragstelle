import { compileFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { nachlassErbfolgePages } from "./pages";
import { kinderFlowConfig } from "./kinderFlowConfig";
import { elternteilFlowConfig } from "./elternteilFlowConfig";

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
      // "no" / "unknown": no Güterstand question, straight to the children step.
      { target: "kinder" },
    ],
    gueterstand: "kinder",
    kinder: [
      { target: "kinderAnzahl", guard: (d) => d.hatteKinder === "yes" },
      { target: "elternteilSummary" },
    ],
    kinderAnzahl: "kind1Summary",
    ...kinderFlowConfig,
    elternteilSummary: [
      { target: "elternteilDaten", type: "addArrayItem" },
      { target: "ergebnis" },
    ],
    ...elternteilFlowConfig,
    ergebnis: null,
  },
});
