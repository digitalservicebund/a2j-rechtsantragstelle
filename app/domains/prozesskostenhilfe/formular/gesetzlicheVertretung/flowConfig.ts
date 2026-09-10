import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type prozesskostenhilfeFormularPages } from "../pages";

export const gesetzlicheVertretungFlowConfig = {
  gesetzlicheVertretungFrage: [],
  gesetzlicheVertretungDaten: [],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
