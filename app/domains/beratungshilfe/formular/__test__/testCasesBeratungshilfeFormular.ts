import { createMachine } from "xstate";
import type { FlowStateMachine } from "~/services/flow/server/types";
import { beratungshilfeFormularUserData } from "..";
import { testCasesBeratungshilfeFormularDefault } from "./testcases";
import { testCasesBeratungshilfeFormularAbgabe } from "../abgabe/__test__/testcases";
import { testCasesBeratungshilfeFormularAnwaltlicheVertretung } from "../anwaltlicheVertretung/__test__/testcases";
import { testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe } from "../finanzielleAngaben/__test__/testcasesAusgaben";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEigentum } from "../finanzielleAngaben/__test__/testcasesEigentum";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEigentumZusammenfassung } from "../finanzielleAngaben/__test__/testcasesEigentumZusammenfassung";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen } from "../finanzielleAngaben/__test__/testcasesEinkommen";
import { testCasesBeratungshilfeFormularFinanzielleAngabenKinder } from "../finanzielleAngaben/__test__/testcasesKinder";
import { testCasesBeratungshilfeFormularFinanzielleAngabenPartner } from "../finanzielleAngaben/__test__/testcasesPartner";
import { testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen } from "../finanzielleAngaben/__test__/testcasesUnterhaltszahlungen";
import { testCasesBeratungshilfeFormularFinanzielleAngabenWohnung } from "../finanzielleAngaben/__test__/testcasesWohnung";
import { testCasesBeratungshilfeFormularGrundvoraussetzungen } from "../grundvoraussetzung/__test__/testcases";
import { testCasesBeratungshilfeRechtsproblem } from "../rechtsproblem/__test__/testcases";

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
