import { type PagesConfig } from "~/domains/pageSchemas";
import { berhAntragFinanzielleAngabenEinkommenPages } from "./einkommen/pages";

export const berhAntragFinanzielleAngabenPages = {
  ...berhAntragFinanzielleAngabenEinkommenPages,
} as const satisfies PagesConfig;
