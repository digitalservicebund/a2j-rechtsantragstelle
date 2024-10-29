import { testCasesBeratungshilfeFormular } from "~/flows/beratungshilfe/formular/__test__/testcases";
import { testCasesBeratungshilfeFormularAnwaltlicheVertretung } from "~/flows/beratungshilfe/formular/anwaltlicheVertretung/__test__/testcases";
import { testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe } from "~/flows/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesAusgaben";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEigentum } from "~/flows/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesEigentum";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEigentumZusammenfassung } from "~/flows/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesEigentumZusammenfassung";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen } from "~/flows/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesEinkommen";
import { testCasesBeratungshilfeFormularFinanzielleAngabenKinder } from "~/flows/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesKinder";
import { testCasesBeratungshilfeFormularFinanzielleAngabenPartner } from "~/flows/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesPartner";
import { testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen } from "~/flows/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesUnterhaltszahlungen";
import { testCasesBeratungshilfeFormularFinanzielleAngabenWohnung } from "~/flows/beratungshilfe/formular/finanzielleAngaben/__test__/testcasesWohnung";
import { testCasesBeratungshilfeRechtsproblem } from "~/flows/beratungshilfe/formular/rechtsproblem/__test__/testcases";
import { testCasesBeratungshilfe } from "~/flows/beratungshilfe/vorabcheck/__test__/testcases";
import { type Context } from "~/flows/contexts";
import { testCasesFluggastrechteFormularGrundvoraussetzungen } from "~/flows/fluggastrechteFormular/grundvoraussetzungen/__test__/testcases";
import { testCasesFluggastrechteFormularPersoenlicheDaten } from "~/flows/fluggastrechteFormular/persoenlicheDaten/__test__/testcases";
import { testCasesFluggastrechteAnnullierung } from "~/flows/fluggastrechteVorabcheck/__test__/testcasesAnnullierung";
import { testCasesFluggastrechteNichtBefoerderung } from "~/flows/fluggastrechteVorabcheck/__test__/testcasesNichtBefoerderung";
import { testCasesFluggastrechteVerspaetet } from "~/flows/fluggastrechteVorabcheck/__test__/testcasesVerspaetet";
import { testCasesGeldEinklagen } from "~/flows/geldEinklagenVorabcheck/__test__/testcases";
import { nextStepId } from "~/services/flow/server/buildFlowController";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import { testCasesFluggastrechteFormularFlugdatenAnnullierung } from "../fluggastrechteFormular/flugdaten/__test__/testcasesAnnullierung";
import { testCasesFluggastrechteFormularFlugdatenNichtBefoerderung } from "../fluggastrechteFormular/flugdaten/__test__/testcasesNichtBefoerderung";
import { testCasesFluggastrechteFormularFlugdatenVerspaetet } from "../fluggastrechteFormular/flugdaten/__test__/testscasesVerspaetet";
import { testCasesFluggastrechteFormularStreitwertKosten } from "../fluggastrechteFormular/streitwertKosten/__test__/testscases";
import { testCasesProzesskostenhilfeFormular } from "~/flows/prozesskostenhilfe/formular/__test__/testcases";
import { testCasesPKHFormularFinanzielleAngabenWohnung } from "~/flows/prozesskostenhilfe/formular/finanzielleAngaben/__test__/testcasesWohnung";
import { testCasesProzesskostenhilfePersoenlicheDaten } from "~/flows/prozesskostenhilfe/formular/persoenlicheDaten/__test__/testcases";
import { testCasesProzesskostenhilfeRsv } from "~/flows/prozesskostenhilfe/formular/rechtsschutzversicherung/__test__/testcases";

function getEnabledSteps({
  machine,
  context,
  transitionType,
  steps,
}: {
  machine: FlowStateMachine;
  context: Context;
  transitionType: "SUBMIT" | "BACK";
  steps: Readonly<Array<string>>;
}) {
  const initialStep = steps[0];
  const reachableSteps = steps.slice(0, -1).map((step) => {
    const destination = nextStepId(machine, step, transitionType, context);
    if (!destination) {
      throw Error(
        `transition destination missing for step: ${step}, transitionType: ${transitionType}`,
      );
    }
    return destination;
  });
  return [initialStep, ...reachableSteps];
}

/*
 * Note on testing xstate
 *
 * > testing state machines and statecharts should be done
 * > by testing the overall behavior of the machine
 * @see https://xstate.js.org/docs/guides/testing.html
 *
 * - given a current state (context/entered form data)
 * - when some sequence of events occurs (next, next, next)
 * - system under test should be in a certain state (step)
 */

describe("state machine form flows", () => {
  [
    testCasesBeratungshilfe,
    testCasesGeldEinklagen,
    testCasesFluggastrechteFormularFlugdatenNichtBefoerderung,
    testCasesBeratungshilfeFormular,
    testCasesBeratungshilfeFormularAnwaltlicheVertretung,
    testCasesBeratungshilfeRechtsproblem,
    testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen,
    testCasesBeratungshilfeFormularFinanzielleAngabenPartner,
    testCasesBeratungshilfeFormularFinanzielleAngabenKinder,
    testCasesBeratungshilfeFormularFinanzielleAngabenEigentum,
    testCasesBeratungshilfeFormularFinanzielleAngabenEigentumZusammenfassung,
    testCasesBeratungshilfeFormularFinanzielleAngabenWohnung,
    testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen,
    testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe,
    testCasesFluggastrechteVerspaetet,
    testCasesFluggastrechteAnnullierung,
    testCasesFluggastrechteNichtBefoerderung,
    testCasesFluggastrechteFormularPersoenlicheDaten,
    testCasesProzesskostenhilfeFormular,
    testCasesPKHFormularFinanzielleAngabenWohnung,
    testCasesFluggastrechteFormularGrundvoraussetzungen,
    testCasesFluggastrechteFormularStreitwertKosten,
    testCasesProzesskostenhilfePersoenlicheDaten,
    testCasesProzesskostenhilfeRsv,
    testCasesFluggastrechteFormularFlugdatenVerspaetet,
    testCasesFluggastrechteFormularFlugdatenAnnullierung,
  ].forEach(({ machine, cases }) => {
    test.each([...cases])(
      "SUBMIT (%#) given context: %j, visits steps: %j",
      (context, steps) => {
        const actualSteps = getEnabledSteps({
          machine,
          context,
          transitionType: "SUBMIT",
          steps,
        });
        expect(actualSteps).toEqual(steps);
      },
    );

    test.each([...cases])(
      "BACK (%#) given context: %j, visits steps: %j",
      (context, steps) => {
        const expectedSteps = [...steps].reverse();
        const actualSteps = getEnabledSteps({
          machine,
          context,
          transitionType: "BACK",
          steps: expectedSteps,
        });
        expect(actualSteps).toEqual(expectedSteps);
      },
    );
  });
});
