import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type prozesskostenhilfeFormularPages } from "../pages";

export const abgabeFlowConfig = {
  abgabe: "abgabeUeberpruefung",
  abgabeUeberpruefung: null,
  zusammenfassung: "ende",
  ende: null,
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
