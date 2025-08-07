import { createMachine } from "xstate";
import type { FlowStateMachine } from "~/services/flow/server/types";
import { testCasesFluggastrechteFluggesellschaftAbbruch } from "./testcasesFluggesellschaftAbbruch";
import { testCasesFluggastrechteNichtBefoerderungAbbruch } from "./testcasesNichtBefoerderungAbbruch";
import { testCasesFluggastrechteAnnullierungAbbruch } from "../__test__/testcasesAnnullierungAbbruch";
import { testCasesFluggastrechteErfolg } from "../__test__/testcasesErfolg";
import { testcasesFluggastrechteErfolgAnalog } from "../__test__/testcasesErfolgAnalog";
import { testCasesFluggastrechteErfolgEU } from "../__test__/testcasesErfolgEU";
import { testcasesFluggastrechtOtherErfolgs } from "../__test__/testcasesOtherErfolgs";
import { testCasesFluggastrechteVerspaetetAbbruch } from "../__test__/testcasesVerspaetetAbbruch";
import { guards } from "../guards";
import { fluggastrechteVorabcheckXstateConfig } from "../xstateConfig";
import {
  testCasesFluggastrechteNichtBefoerderungErfolg,
  testCasesFluggastrechteNichtBefoerderungVertretbareGruende,
} from "./testcasesNichtBefoerderungErfolg";

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
  ...testCasesFluggastrechteNichtBefoerderungErfolg,
  ...testCasesFluggastrechteNichtBefoerderungVertretbareGruende,
  ...testcasesFluggastrechtOtherErfolgs,
  ...testCasesFluggastrechteVerspaetetAbbruch,
  ...testCasesFluggastrechteFluggesellschaftAbbruch,
];

export const testCasesFluggastrechteVorabcheck = {
  machine,
  cases: testsCases,
};
