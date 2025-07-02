import { createMachine } from "xstate";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import { testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugYes } from "~/domains/fluggastrechte/formular/flugdaten/__test__/testcasesAnnullierungWithErsatzflugYes";
import { testCasesFluggastrechteFormularFlugdatenNichtBefoerderung } from "~/domains/fluggastrechte/formular/flugdaten/__test__/testcasesNichtBefoerderung";
import { testCasesFluggastrechteFormularFlugdatenVerspaetet } from "~/domains/fluggastrechte/formular/flugdaten/__test__/testscasesVerspaetet";
import { testCasesFluggastrechteFormularGrundvoraussetzungen } from "~/domains/fluggastrechte/formular/grundvoraussetzungen/__test__/testcases";
import { fluggastrechteGuards } from "~/domains/fluggastrechte/formular/guards";
import { testCasesFluggastrechteFormularPersoenlicheDaten } from "~/domains/fluggastrechte/formular/persoenlicheDaten/__test__/testcases";
import { testCasesFluggastrechteFormularProzessfuehrung } from "~/domains/fluggastrechte/formular/prozessfuehrung/__test__/testcases";
import { testCasesFluggastrechteFormularStreitwertKosten } from "~/domains/fluggastrechte/formular/streitwertKosten/__test__/testscases";
import { type FlowStateMachine } from "~/services/flow/server/types";
import { testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugNo } from "../flugdaten/__test__/testcasesAnnullierungWithErsatzflugNo";

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
