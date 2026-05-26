import { compileFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { nachlassErbfolgePages } from "./pages";
import { kinderFlowConfig } from "./kinderFlowConfig";

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
    ehepartner: null,
    kinder: [
      { target: "kinderAnzahl", guard: (d) => d.hatteKinder === "yes" },
      { target: null },
    ],
    kinderAnzahl: "kind1Summary",
    ...kinderFlowConfig,
  },
});
