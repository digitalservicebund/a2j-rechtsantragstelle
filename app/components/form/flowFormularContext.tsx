import { createContext, useContext } from "react";
import { Context } from "~/domains/contexts";

type FlowFormularContext = {
  userData: Context;
  validFlowPages?: Record<string, string[]>;
};

export const FlowFormularContext = createContext<FlowFormularContext>({
  userData: {},
  validFlowPages: {},
});

export function useFlowForm(): FlowFormularContext {
  return useContext(FlowFormularContext);
}
