import { createMachine } from "xstate";
import type { FlowStateMachine } from "~/services/flow/server/types";
import { testCasesFluggastrechteAnnullierungAbbruch } from "../__test__/testcasesAnnullierungAbbruch";
import { testCasesFluggastrechteErfolg } from "../__test__/testcasesErfolg";
import { testcasesFluggastrechteErfolgAnalog } from "../__test__/testcasesErfolgAnalog";
import { testCasesFluggastrechteErfolgEU } from "../__test__/testcasesErfolgEU";
import { testCasesFluggastrechteNichtBefoerderungAbbruch } from "../__test__/testcasesNichtBefoerderungAbbruch";
import { testcasesFluggastrechtOtherErfolgs } from "../__test__/testcasesOtherErfolgs";
import { testCasesFluggastrechteVerspaetetAbbruch } from "../__test__/testcasesVerspaetetAbbruch";
import { guards } from "../guards";
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
