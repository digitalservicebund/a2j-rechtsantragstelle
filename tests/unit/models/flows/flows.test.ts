import { getEnabledSteps } from "tests/unit/models/flows/getEnabledSteps";
import { testCasesBeratungshilfe } from "./beratungshilfe/testcases";
import { testCasesGeldEinklagen } from "./geldEinklagen/testcases";
import { testCasesFluggastrechteFormular } from "tests/unit/models/flows/fluggastrechteFormular/testcases";
import { testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen } from "./beratungshilfeFormular/finanzielleAngaben/testcasesEinkommen";
import { testCasesBeratungshilfeFormularFinanzielleAngabenPartner } from "./beratungshilfeFormular/finanzielleAngaben/testcasesPartner";
import { testCasesBeratungshilfeFormularFinanzielleAngabenKinder } from "./beratungshilfeFormular/finanzielleAngaben/testcasesKinder";
import { testCasesBeratungshilfeFormularFinanzielleAngabenBesitz } from "./beratungshilfeFormular/finanzielleAngaben/testcasesBesitz";
import { testCasesBeratungshilfeFormularFinanzielleAngabenBesitzZusammenfassung } from "./beratungshilfeFormular/finanzielleAngaben/testcasesBesitzZusammenfassung";
import { testCasesBeratungshilfeRechtsproblem } from "./beratungshilfeFormular/rechtsprobleme/testcases";

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
    testCasesBeratungshilfeRechtsproblem,
    testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen,
    testCasesBeratungshilfeFormularFinanzielleAngabenPartner,
    testCasesBeratungshilfeFormularFinanzielleAngabenKinder,
    testCasesBeratungshilfeFormularFinanzielleAngabenBesitz,
    testCasesBeratungshilfeFormularFinanzielleAngabenBesitzZusammenfassung,
  ].forEach(({ machine, cases }) => {
    test.each(cases)(
      "SUBMIT (%#) given context: %j, visits steps: %j",
      (context, steps) => {
        const expectedSteps = steps;
        const actualSteps = getEnabledSteps({
          machine,
          context,
          transitionType: "SUBMIT",
          steps: expectedSteps,
        });
        expect(actualSteps).toEqual(expectedSteps);
      },
    );

    test.each(cases)(
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
