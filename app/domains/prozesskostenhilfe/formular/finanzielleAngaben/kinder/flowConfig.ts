import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";

export const kinderFlowConfig = {
  kinderFrage: [],
  kinderUebersicht: [],
  kinderWarnung: [],
  kinder: [],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
