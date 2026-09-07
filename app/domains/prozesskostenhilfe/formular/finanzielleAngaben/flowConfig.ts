import { pkhFormularFinanzielleAngabenPages } from "./pages";
import { finanzielleAngabenAbzuegeFlowConfig } from "./abzuege/flowConfig";
import { TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const finanzielleAngabenFlowConfig =  {

    ...finanzielleAngabenAbzuegeFlowConfig.transitions,

} satisfies Partial<TransitionConfigMap<typeof pkhFormularFinanzielleAngabenPages>>