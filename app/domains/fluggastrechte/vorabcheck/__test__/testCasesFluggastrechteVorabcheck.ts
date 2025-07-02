import { createMachine } from "xstate";
import { testCasesFluggastrechteAnnullierungAbbruch } from "~/domains/fluggastrechte/vorabcheck/__test__/testcasesAnnullierungAbbruch";
import { testCasesFluggastrechteErfolg } from "~/domains/fluggastrechte/vorabcheck/__test__/testcasesErfolg";
import { testcasesFluggastrechteErfolgAnalog } from "~/domains/fluggastrechte/vorabcheck/__test__/testcasesErfolgAnalog";
import { testCasesFluggastrechteErfolgEU } from "~/domains/fluggastrechte/vorabcheck/__test__/testcasesErfolgEU";
import { testCasesFluggastrechteNichtBefoerderungAbbruch } from "~/domains/fluggastrechte/vorabcheck/__test__/testcasesNichtBefoerderungAbbruch";
import { testcasesFluggastrechtOtherErfolgs } from "~/domains/fluggastrechte/vorabcheck/__test__/testcasesOtherErfolgs";
import { testCasesFluggastrechteVerspaetetAbbruch } from "~/domains/fluggastrechte/vorabcheck/__test__/testcasesVerspaetetAbbruch";
import { guards } from "~/domains/fluggastrechte/vorabcheck/guards";
import type { FlowStateMachine } from "~/services/flow/server/types";
import { fluggastrechteVorabcheckXstateConfig } from "../xstateConfig";
import { testCasesFluggastrechteFluggesellschaftAbbruch } from "./testcasesFluggesellschaftAbbruch";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechteVorabcheckXstateConfig, context: {} },
  { guards },
);

const testsCases = [
  ...testCasesFluggastrechteAnnullierungAbbruch,
  ...testCasesFluggastrechteErfolg,
  ...testcasesFluggastrechteErfolgAnalog,
  ...testCasesFluggastrechteErfolgEU,
  ...testCasesFluggastrechteNichtBefoerderungAbbruch,
  ...testcasesFluggastrechtOtherErfolgs,
  ...testCasesFluggastrechteVerspaetetAbbruch,
  ...testCasesFluggastrechteFluggesellschaftAbbruch,
];

export const testCasesFluggastrechteVorabcheck = {
  machine,
  cases: testsCases,
};
