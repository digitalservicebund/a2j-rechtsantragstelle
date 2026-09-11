import type { FlowTestConfig } from "~/domains/__test__/TestCases";
import type { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { fluggastrechteVorabcheckFlowConfig } from "../../flowConfig";
import { fluggastrechteVorabcheckXstateConfig } from "../../xstateConfig";
import type { FluggastrechtVorabcheckUserData } from "../../userData";
import { testCasesFluggastrechteAnnullierungAbbruchNewFlowEngine } from "./testcasesAnnullierungAbbruchNewFlowEngine";
import { testCasesFluggastrechteErfolgNewFlowEngine } from "./testcasesErfolgNewFlowEngine";
import { testcasesFluggastrechteErfolgAnalogNewFlowEngine } from "./testcasesErfolgAnalogNewFlowEngine";
import { testCasesFluggastrechteErfolgEUNewFlowEngine } from "./testcasesErfolgEUNewFlowEngine";
import { testCasesFluggastrechteFluggesellschaftAbbruchNewFlowEngine } from "./testcasesFluggesellschaftAbbruchNewFlowEngine";
import { testCasesFluggastrechteNichtBefoerderungAbbruchNewFlowEngine } from "./testcasesNichtBefoerderungAbbruchNewFlowEngine";
import { testCasesFluggastrechteNichtBefoerderungErfolgNewFlowEngine } from "./testcasesNichtBefoerderungErfolgNewFlowEngine";
import { testCasesFluggastrechteNichtBefoerderungVertretbareGruendeNewFlowEngine } from "./testcasesNichtBefoerderungVertretbareGruendeNewFlowEngine";
import { testcasesFluggastrechtOtherErfolgsNewFlowEngine } from "./testcasesOtherErfolgsNewFlowEngine";
import { testCasesFluggastrechteVerspaetetAbbruchNewFlowEngine } from "./testcasesVerspaetetAbbruchNewFlowEngine";

export const fluggastrechteVorabcheckTestCases = {
  xstateConfig: fluggastrechteVorabcheckXstateConfig,
  newEngineConfig: fluggastrechteVorabcheckFlowConfig,
  testcases: {
    ...testCasesFluggastrechteAnnullierungAbbruchNewFlowEngine,
    ...testCasesFluggastrechteErfolgNewFlowEngine,
    ...testcasesFluggastrechteErfolgAnalogNewFlowEngine,
    ...testCasesFluggastrechteErfolgEUNewFlowEngine,
    ...testCasesFluggastrechteFluggesellschaftAbbruchNewFlowEngine,
    ...testCasesFluggastrechteNichtBefoerderungAbbruchNewFlowEngine,
    ...testCasesFluggastrechteNichtBefoerderungErfolgNewFlowEngine,
    ...testCasesFluggastrechteNichtBefoerderungVertretbareGruendeNewFlowEngine,
    ...testcasesFluggastrechtOtherErfolgsNewFlowEngine,
    ...testCasesFluggastrechteVerspaetetAbbruchNewFlowEngine,
  },
} satisfies FlowTestConfig<FluggastrechtVorabcheckUserData, PageConfigMap>;
