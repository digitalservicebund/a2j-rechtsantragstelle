import type { Flow } from "~/domains/flows.server";
import { grundbuchauszugAntragFlowConfig } from "./flowConfig";

export const grundbuchauszugAntrag = {
  flowType: "formFlow",
  stringReplacements: () => ({}),
  config: grundbuchauszugAntragFlowConfig,
} satisfies Flow<typeof grundbuchauszugAntragFlowConfig.pages>;
