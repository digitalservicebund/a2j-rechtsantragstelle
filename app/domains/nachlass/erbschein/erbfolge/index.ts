import { type Flow } from "~/domains/flows.server";
import { type CompiledFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { erbfolgeStaticFlow } from "./flowConfig";
import { erbfolgeStringReplacements } from "../shared/stringReplacements";

export const erbscheinErbfolge = {
  flowType: "vorabCheck",
  config: { states: {} },
  // The compiled flow keeps its precise per-page types for direct consumers (the
  // result route). Here it is widened to the shared registry's flow type, where
  // every flow is handled generically as CompiledFlow<PageConfigMap>.
  newEngineConfig: erbfolgeStaticFlow as CompiledFlow<PageConfigMap>,
  stringReplacements: erbfolgeStringReplacements,
} satisfies Flow<PageConfigMap>;
