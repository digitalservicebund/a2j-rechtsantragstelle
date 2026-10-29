import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/flowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";
import { grundbuchauszugAntragPages } from "./pages";

export const grundbuchauszugAntragFlowConfig = compileFlow({
  pages: grundbuchauszugAntragPages,
  initialStep: "start",
  transitions: {
    start: null,
  },
}) as CompiledFlow<PageConfigMap>;
