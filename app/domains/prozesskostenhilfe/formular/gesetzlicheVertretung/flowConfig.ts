import { TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../pages";

export const gesetzlicheVertretungFlowConfig = {
 gesetzlicheVertretungFrage: [],
 gesetzlicheVertretungDaten: [],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;