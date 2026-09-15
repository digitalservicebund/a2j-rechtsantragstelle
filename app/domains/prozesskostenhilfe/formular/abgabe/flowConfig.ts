import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type prozesskostenhilfeFormularPages } from "../pages";

export const abgabeFlowConfig = {
  abgabe: [],
  abgabeUeberpruefung: [],
  zusammenfassung: [],
  ende: [],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
