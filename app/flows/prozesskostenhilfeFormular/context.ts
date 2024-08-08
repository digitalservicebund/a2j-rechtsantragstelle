import { prozesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import { beratungshilfeAbgabe } from "../beratungshilfeFormular/abgabe/context";

export const prozesskostenhilfeFormularContext = {
  ...prozesskostenhilfeFinanzielleAngabenContext,
  ...beratungshilfeAbgabe,
} as const;
