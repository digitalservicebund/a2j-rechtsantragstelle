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

type FormFlowContext = {
  userData: Context;
  validFlowPages: ValidFlowPagesType;
  translations: Translations;
  flowId: FlowId;
};

export const FormFlowContext = createContext<FormFlowContext>({
  userData: {},
  validFlowPages: {},
  translations: {},
  flowId: "/fluggastrechte/formular",
});

export function useFormFlow(): FormFlowContext {
  return useContext(FormFlowContext);
}
