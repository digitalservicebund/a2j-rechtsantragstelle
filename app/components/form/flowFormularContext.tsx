import { createContext, useContext } from "react";
import { Context } from "~/domains/contexts";
import { FlowId } from "~/domains/flowIds";
import { Translations } from "~/services/translations/getTranslationByKey";

export type ValidFlowPagesType = Record<
  string,
  {
    fields: string[];
    isArrayPage: boolean;
  }
>;

type FlowFormularContext = {
  userData: Context;
  validFlowPages: ValidFlowPagesType;
  translations: Translations;
  flowId: FlowId;
};

export const FlowFormularContext = createContext<FlowFormularContext>({
  userData: {},
  validFlowPages: {},
  translations: {},
  flowId: "/fluggastrechte/formular",
});

export function useFlowFormular(): FlowFormularContext {
  return useContext(FlowFormularContext);
}
