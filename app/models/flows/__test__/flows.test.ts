import { parsePathname, type Context } from "~/models/flows/contexts";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import { transitionDestinations } from "~/services/flow/server/buildFlowController";
import { testCasesBeratungshilfe } from "~/models/flows/beratungshilfe/__test__/testcases";
import { testCasesGeldEinklagen } from "~/models/flows/geldEinklagen/__test__/testcases";
import { testCasesFluggastrechteFormular } from "~/models/flows/fluggastrechteFormular/__test__/testcases";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesEinkommen";
import { testCasesBeratungshilfeFormularFinanzielleAngabenPartner } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesPartner";
import { testCasesBeratungshilfeFormularFinanzielleAngabenKinder } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesKinder";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEigentum } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesEigentum";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEigentumZusammenfassung } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesEigentumZusammenfassung";
import { testCasesBeratungshilfeRechtsproblem } from "~/models/flows/beratungshilfeFormular/rechtsproblem/__test__/testcases";
import { testCasesBeratungshilfeFormularFinanzielleAngabenWohnung } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesWohnung";
import { testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesUnterhaltszahlungen";
import { testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/__test__/testcasesAusgaben";
import { testCasesBeratungshilfeFormular } from "~/models/flows/beratungshilfeFormular/__test__/testcases";
import { testCasesBeratungshilfeFormularAnwaltlicheVertretung } from "~/models/flows/beratungshilfeFormular/anwaltlicheVertretung/__test__/testcases";
import { testCasesFluggastrechte } from "~/models/flows/fluggastrechte/__test__/testcases";

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
    testCasesFluggastrechte,
  ].forEach(({ machine, cases }) => {
    test.each(cases)(
      "SUBMIT (%#) given context: %j, visits steps: %j",
      (context, steps) => {
        const expectedSteps = steps as Array<string>;
        const contextCase = context as Context;
        const actualSteps = getEnabledSteps({
          machine,
          context: contextCase,
          transitionType: "SUBMIT",
          steps: expectedSteps,
        });
        expect(actualSteps).toEqual(expectedSteps);
      },
    );

    test.each(cases)(
      "BACK (%#) given context: %j, visits steps: %j",
      (context, steps) => {
        const expectedSteps = [...(steps as Array<string>)].reverse();
        const contextCase = context as Context;
        const actualSteps = getEnabledSteps({
          machine,
          context: contextCase,
          transitionType: "BACK",
          steps: expectedSteps,
        });
        expect(actualSteps).toEqual(expectedSteps);
      },
    );
  });
});
