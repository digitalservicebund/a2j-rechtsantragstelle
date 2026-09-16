import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type prozesskostenhilfeFormularPages } from "../pages";
import { hasGesetzlicheVertretungYes } from "./guards";

export const gesetzlicheVertretungFlowConfig = {
  gesetzlicheVertretungFrage: [
    {
      guard: (context) => hasGesetzlicheVertretungYes({ context }),
      target: "gesetzlicheVertretungDaten",
    },
    { target: "persoenlicheDatenStart" },
  ],
  gesetzlicheVertretungDaten: "persoenlicheDatenStart",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
