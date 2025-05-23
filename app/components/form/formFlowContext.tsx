import { createContext, useContext } from "react";
import { type FlowId } from "~/domains/flowIds";
import { type UserData } from "~/domains/userData";
import { type Translations } from "~/services/translations/getTranslationByKey";

export type ValidFlowPagesType = Record<
  string,
  {
    isArrayPage: boolean;
  }
>;

type FormFlowContext = {
  userData: UserData;
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
