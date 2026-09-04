import { TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { pkhFormularFinanzielleAngabenPages } from "./pages";

export const finanzielleAngabenFlowConfig = {

} satisfies Partial<
  TransitionConfigMap<typeof pkhFormularFinanzielleAngabenPages>
>;
