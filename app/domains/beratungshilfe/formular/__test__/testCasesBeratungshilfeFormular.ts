import { createMachine } from "xstate";
import { beratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";
import { testCasesBeratungshilfeFormularDefault } from "~/domains/beratungshilfe/formular/__test__/testcases";
import { testCasesBeratungshilfeFormularAbgabe } from "~/domains/beratungshilfe/formular/abgabe/__test__/testcases";
import { testCasesBeratungshilfeFormularAnwaltlicheVertretung } from "~/domains/beratungshilfe/formular/anwaltlicheVertretung/__test__/testcases";
import { testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesAusgaben";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEigentum } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesEigentum";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEigentumZusammenfassung } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesEigentumZusammenfassung";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesEinkommen";
import { testCasesBeratungshilfeFormularFinanzielleAngabenKinder } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesKinder";
import { testCasesBeratungshilfeFormularFinanzielleAngabenPartner } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesPartner";
import { testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesUnterhaltszahlungen";
import { testCasesBeratungshilfeFormularFinanzielleAngabenWohnung } from "~/domains/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesWohnung";
import { testCasesBeratungshilfeFormularGrundvoraussetzungen } from "~/domains/beratungshilfe/formular/grundvoraussetzung/__test__/testcases";
import { testCasesBeratungshilfeRechtsproblem } from "~/domains/beratungshilfe/formular/rechtsproblem/__test__/testcases";
import type { FlowStateMachine } from "~/services/flow/server/types";

const machine: FlowStateMachine = createMachine(
  beratungshilfeFormularUserData.config,
  {
    guards: beratungshilfeFormularUserData.guards,
  },
);

const testsCases = [
  ...testCasesBeratungshilfeFormularDefault,
  ...testCasesBeratungshilfeFormularAbgabe,
  ...testCasesBeratungshilfeFormularAnwaltlicheVertretung,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenEigentum,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenEigentumZusammenfassung,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenKinder,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenPartner,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen,
  ...testCasesBeratungshilfeFormularFinanzielleAngabenWohnung,
  ...testCasesBeratungshilfeFormularGrundvoraussetzungen,
  ...testCasesBeratungshilfeRechtsproblem,
];

export const testCasesBeratungshilfeFormular = {
  machine,
  cases: testsCases,
};
