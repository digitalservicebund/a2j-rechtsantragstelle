import { type FlowRoutingConfig } from "~/services/flow/newFlowEngine/types";
import { type ErbfolgePages } from "./pages";

export const childrenFlowConfig = {
  childrenArraySummary: [
    { target: "childInfo", type: "addArrayItem" },
    { target: "end" },
  ],
  childInfo: [
    {
      target: "childChildrenSummary",
      guard: ({ children, pageData: { arrayIndexes } }) => {
        if (!children || !arrayIndexes) return false;
        if (arrayIndexes.length < 1 || children.length <= arrayIndexes[0])
          return false;
        const { isAlive, hasChildren } = children[arrayIndexes[0]];
        return isAlive === "no" && hasChildren === "yes";
      },
    },
    {
      target: "childrenArraySummary",
      guard: () => true,
    },
  ],
  childChildrenSummary: [
    { target: "childChildInfo", type: "addArrayItem" },
    { target: "childrenArraySummary" },
  ],
  childChildInfo: [
    {
      target: "childChildChildrenSummary",
      guard: ({ children, pageData: { arrayIndexes } }) => {
        if (!children || !arrayIndexes || arrayIndexes.length < 2) return false;
        const child = children[arrayIndexes[0]];
        if (!("children" in child) || child.children.length <= arrayIndexes[1])
          return false;
        const { isAlive, hasChildren } = child.children[arrayIndexes[1]];
        return isAlive === "no" && hasChildren === "yes";
      },
    },
    {
      target: "childChildrenSummary",
      guard: () => true,
    },
  ],
  childChildChildrenSummary: [
    {
      target: "childChildChildInfo",
      type: "addArrayItem",
    },
    { target: "childChildrenSummary" },
  ],
  childChildChildInfo: "childChildChildrenSummary",
} satisfies Partial<FlowRoutingConfig<ErbfolgePages>>;
