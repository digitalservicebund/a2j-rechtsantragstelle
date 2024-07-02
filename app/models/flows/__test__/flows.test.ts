import { testCasesBeratungshilfe } from "~/models/flows/beratungshilfe/__test__/testcases";
import { testCasesBeratungshilfeFormular } from "~/models/flows/beratungshilfeFormular/__test__/testcases";
import { testCasesBeratungshilfeFormularAnwaltlicheVertretung } from "~/models/flows/beratungshilfeFormular/anwaltlicheVertretung/__test__/testcases";
import { testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesAusgaben";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEigentum } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesEigentum";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEigentumZusammenfassung } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesEigentumZusammenfassung";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesEinkommen";
import { testCasesBeratungshilfeFormularFinanzielleAngabenKinder } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesKinder";
import { testCasesBeratungshilfeFormularFinanzielleAngabenPartner } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesPartner";
import { testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesUnterhaltszahlungen";
import { testCasesBeratungshilfeFormularFinanzielleAngabenWohnung } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesWohnung";
import { testCasesBeratungshilfeRechtsproblem } from "~/models/flows/beratungshilfeFormular/rechtsproblem/__test__/testcases";
import { type Context } from "~/models/flows/contexts";
import { testCasesFluggastrechteAnnullierung } from "~/models/flows/fluggastrechte/__test__/testcasesAnnullierung";
import { testCasesFluggastrechteNichtBefoerderung } from "~/models/flows/fluggastrechte/__test__/testcasesNichtBefoerderung";
import { testCasesFluggastrechteVerspaetet } from "~/models/flows/fluggastrechte/__test__/testcasesVerspaetet";
import { testCasesFluggastrechteFormular } from "~/models/flows/fluggastrechteFormular/__test__/testcases";
import { testCasesGeldEinklagen } from "~/models/flows/geldEinklagen/__test__/testcases";
import { transitionDestinations } from "~/services/flow/server/buildFlowController";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import { parsePathname } from "../flowIds";

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
    const transDest = transitionDestinations(
      machine,
      step,
      transitionType,
      context,
    );
    const { stepId } = parsePathname(transDest?.at(0) ?? "");
    return stepId;
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
    testCasesFluggastrechteFormular,
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
