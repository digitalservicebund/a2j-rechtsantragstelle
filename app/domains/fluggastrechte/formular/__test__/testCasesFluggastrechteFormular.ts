import { createMachine } from "xstate";
import { type FlowStateMachine } from "~/services/flow/server/types";
import { fluggastrechtFlow } from "..";
import { testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugNo } from "../flugdaten/__test__/testcasesAnnullierungWithErsatzflugNo";
import { testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugYes } from "../flugdaten/__test__/testcasesAnnullierungWithErsatzflugYes";
import { testCasesFluggastrechteFormularFlugdatenNichtBefoerderung } from "../flugdaten/__test__/testcasesNichtBefoerderung";
import { testCasesFluggastrechteFormularFlugdatenVerspaetet } from "../flugdaten/__test__/testscasesVerspaetet";
import { testCasesFluggastrechteFormularGrundvoraussetzungen } from "../grundvoraussetzungen/__test__/testcases";
import { fluggastrechteGuards } from "../guards";
import { testCasesFluggastrechteFormularPersoenlicheDaten } from "../persoenlicheDaten/__test__/testcases";
import { testCasesFluggastrechteFormularProzessfuehrung } from "../prozessfuehrung/__test__/testcases";
import { testCasesFluggastrechteFormularStreitwertKosten } from "../streitwertKosten/__test__/testscases";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechtFlow.config, context: {} },
  { guards: fluggastrechteGuards },
);

const testsCases = [
  ...testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugYes,
  ...testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugNo,
  ...testCasesFluggastrechteFormularFlugdatenNichtBefoerderung,
  ...testCasesFluggastrechteFormularFlugdatenVerspaetet,
  ...testCasesFluggastrechteFormularGrundvoraussetzungen,
  ...testCasesFluggastrechteFormularPersoenlicheDaten,
  ...testCasesFluggastrechteFormularProzessfuehrung,
  ...testCasesFluggastrechteFormularStreitwertKosten,
];

export const testCasesFluggastrechteFormular = {
  machine,
  cases: testsCases,
};
