import { compileFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { erbfolgePages } from "./pages";
import { childrenFlowConfig } from "./childrenFlowConfig";

export const erbfolgeStaticFlow = compileFlow({
  pages: erbfolgePages,
  initialStep: "start",
  transitions: {
    start: "hasChildren",
    hasChildren: [
      { target: "childrenArraySummary", guard: (d) => d.hasChildren === "yes" },
      {
        target: "end",
        guard: (d) => d.hasChildren === "no",
      },
    ],
    ...childrenFlowConfig,
    end: null,
  },
});
