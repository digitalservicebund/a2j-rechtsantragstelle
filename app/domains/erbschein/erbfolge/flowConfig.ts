import { createStaticFlow } from "~/services/flow/newFlowEngine/staticManager";
import { erbfolgePages } from "./pages";
import { childrenFlowConfig } from "./childrenFlowConfig";

export const erbfolgeStaticFlow = createStaticFlow({
  config: erbfolgePages,
  initialStep: "start",
  flowConfig: {
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
