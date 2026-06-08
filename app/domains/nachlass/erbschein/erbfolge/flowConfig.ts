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
      { target: null },
    ],
    gueterstand: "kinder",
    kinder: [
      { target: "kinderAnzahl", guard: (d) => d.hatteKinder === "yes" },
      { target: "elternteile" },
    ],
    kinderAnzahl: "kind1Summary",
    ...kinderFlowConfig,
    elternteile: "elternteilSummary",
    elternteilSummary: [
      { target: "elternteilDaten", type: "addArrayItem" },
      {
        target: "gemeinsameKinderAnzahl",
        guard: ({ elternteile }) => {
          if (!elternteile || elternteile.length < 2) return false;
          return elternteile[0].isAlive === "no" && elternteile[1].isAlive === "no";
        },
      },
      { target: null },
    ],
    ...elternteilFlowConfig,
  },
});
