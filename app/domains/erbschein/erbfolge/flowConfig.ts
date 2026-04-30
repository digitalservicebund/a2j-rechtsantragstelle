import { compileFlowConfig } from "~/services/flow/newFlowEngine/compileStaticFlow";
import { erbfolgePages } from "./pages";
import { childrenFlowConfig } from "./childrenFlowConfig";

export const erbfolgeStaticFlow = compileFlowConfig({
  pageNodeMap: erbfolgePages,
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
