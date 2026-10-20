import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";
import { type prozesskostenhilfeFormularPages } from "../pages";
export const gesetzlicheVertretungFlowConfig = {
  gesetzlicheVertretungFrage: [
    {
      guard: (context) => context.hasGesetzlicheVertretung === "yes",
      target: "gesetzlicheVertretungDaten",
    },
    { target: "persoenlicheDatenStart" },
  ],
  gesetzlicheVertretungDaten: "persoenlicheDatenStart",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
