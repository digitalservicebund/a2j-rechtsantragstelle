import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type prozesskostenhilfeFormularPages } from "../pages";
import { readyForAbgabe } from "./guards";

export const abgabeFlowConfig = {
  abgabe: "abgabeUeberpruefung",
  abgabeUeberpruefung: [
    {
      guard: (context) => readyForAbgabe({ context }),
      target: "zusammenfassung",
    },
  ],
  zusammenfassung: "ende",
  ende: null,
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
