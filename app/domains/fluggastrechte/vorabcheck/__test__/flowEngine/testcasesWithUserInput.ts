import type { FlowTestConfig } from "~/domains/__test__/TestCases";
import type { PageConfigMap } from "~/services/flow/flowEngine/types";
import { fluggastrechteVorabcheckFlowConfig } from "../../flowConfig";
import type { FluggastrechtVorabcheckUserData } from "../../userData";
import { testCasesFluggastrechteAnnullierungAbbruch } from "./testcasesAnnullierungAbbruch";
import { testCasesFluggastrechteErfolg } from "./testcasesErfolg";
import { testcasesFluggastrechteErfolgAnalog } from "./testcasesErfolgAnalog";
import { testCasesFluggastrechteErfolgEU } from "./testcasesErfolgEU";
import { testCasesFluggastrechteFluggesellschaftAbbruch } from "./testcasesFluggesellschaftAbbruch";
import { testCasesFluggastrechteNichtBefoerderungAbbruch } from "./testcasesNichtBefoerderungAbbruch";
import { testCasesFluggastrechteNichtBefoerderungErfolg } from "./testcasesNichtBefoerderungErfolg";
import { testCasesFluggastrechteNichtBefoerderungVertretbareGruende } from "./testcasesNichtBefoerderungVertretbareGruende";
import { testcasesFluggastrechtOtherErfolgs } from "./testcasesOtherErfolgs";
import { testCasesFluggastrechteVerspaetetAbbruch } from "./testcasesVerspaetetAbbruch";

export const fluggastrechteVorabcheckTestCases = {
  flowId: "/fluggastrechte/vorabcheck",
  config: fluggastrechteVorabcheckFlowConfig,
  testcases: {
    ...testCasesFluggastrechteAnnullierungAbbruch,
    ...testCasesFluggastrechteErfolg,
    ...testcasesFluggastrechteErfolgAnalog,
    ...testCasesFluggastrechteErfolgEU,
    ...testCasesFluggastrechteFluggesellschaftAbbruch,
    ...testCasesFluggastrechteNichtBefoerderungAbbruch,
    ...testCasesFluggastrechteNichtBefoerderungErfolg,
    ...testCasesFluggastrechteNichtBefoerderungVertretbareGruende,
    ...testcasesFluggastrechtOtherErfolgs,
    ...testCasesFluggastrechteVerspaetetAbbruch,
  },
} satisfies FlowTestConfig<FluggastrechtVorabcheckUserData, PageConfigMap>;
