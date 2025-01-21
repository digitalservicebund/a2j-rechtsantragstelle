import { toDirectedGraph, type DirectedGraphNode } from "@xstate/graph";
import { pathToStateValue } from "xstate";
import { testCasesBeratungshilfeFormular } from "~/domains/beratungshilfe/formular/__test__/testcases";
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
import { testCasesBeratungshilfe } from "~/domains/beratungshilfe/vorabcheck/__test__/testcases";
import { type Context } from "~/domains/contexts";
import { testCasesFluggastrechteFormularFlugdatenAnnullierung } from "~/domains/fluggastrechte/formular/flugdaten/__test__/testcasesAnnullierung";
import { testCasesFluggastrechteFormularFlugdatenNichtBefoerderung } from "~/domains/fluggastrechte/formular/flugdaten/__test__/testcasesNichtBefoerderung";
import { testCasesFluggastrechteFormularFlugdatenVerspaetet } from "~/domains/fluggastrechte/formular/flugdaten/__test__/testscasesVerspaetet";
import { testCasesFluggastrechteFormularGrundvoraussetzungen } from "~/domains/fluggastrechte/formular/grundvoraussetzungen/__test__/testcases";
import { testCasesFluggastrechteFormularPersoenlicheDaten } from "~/domains/fluggastrechte/formular/persoenlicheDaten/__test__/testcases";
import { testCasesFluggastrechteFormularProzessfuehrung } from "~/domains/fluggastrechte/formular/prozessfuehrung/__test__/testcases";
import { testCasesFluggastrechteFormularStreitwertKosten } from "~/domains/fluggastrechte/formular/streitwertKosten/__test__/testscases";
import { testCasesFluggastrechteAnnullierungAbbruch } from "~/domains/fluggastrechte/vorabcheck/__test__/testcasesAnnullierungAbbruch";
import { testCasesFluggastrechteErfolg } from "~/domains/fluggastrechte/vorabcheck/__test__/testcasesErfolg";
import { testcasesFluggastrechteErfolgAnalog } from "~/domains/fluggastrechte/vorabcheck/__test__/testcasesErfolgAnalog";
import { testCasesFluggastrechteErfolgEU } from "~/domains/fluggastrechte/vorabcheck/__test__/testcasesErfolgEU";
import { testCasesFluggastrechteNichtBefoerderungAbbruch } from "~/domains/fluggastrechte/vorabcheck/__test__/testcasesNichtBefoerderungAbbruch";
import { testcasesFluggastrechtOtherErfolgs } from "~/domains/fluggastrechte/vorabcheck/__test__/testcasesOtherErfolgs";
import { testCasesFluggastrechteVerspaetetAbbruch } from "~/domains/fluggastrechte/vorabcheck/__test__/testcasesVerspaetetAbbruch";
import { testCasesGeldEinklagen } from "~/domains/geldEinklagen/vorabcheck/__test__/testcases";
import { testCasesProzesskostenhilfeFormular } from "~/domains/prozesskostenhilfe/formular/__test__/testcases";
import { testCasesProzesskostenhilfePersoenlicheDaten } from "~/domains/prozesskostenhilfe/formular/persoenlicheDaten/__test__/testcases";
import {
  testCasesProzesskostenhilfeForwardOnly,
  testCasesProzesskostenhilfeRsv,
} from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/__test__/testcases";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import { nextStepId } from "~/services/flow/server/buildFlowController";
import { stateValueToStepIds } from "~/services/flow/stepIdConverter";

function getEnabledSteps({
  machine,
  context,
  transitionType,
  steps,
}: {
  machine: FlowStateMachine;
  context: Context;
  transitionType: "SUBMIT" | "BACK";
  steps: readonly string[];
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

function statePathsFromMachine(children: DirectedGraphNode[]): string[][] {
  return children.flatMap((child) =>
    child.children.length > 0
      ? statePathsFromMachine(child.children)
      : [child.stateNode.path],
  );
}

function allStepsFromMachine(machine: FlowStateMachine) {
  const machineState = statePathsFromMachine(toDirectedGraph(machine).children);
  return machineState.map(
    (statePath) => stateValueToStepIds(pathToStateValue(statePath))[0],
  );
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

describe.sequential("state machine form flows", () => {
  const allVisitedSteps: Record<
    string,
    { stepIds: string[]; machine: FlowStateMachine }
  > = {};

  const testCases = {
    testCasesBeratungshilfe,
    testCasesGeldEinklagen,
    testCasesFluggastrechteFormularFlugdatenNichtBefoerderung,
    testCasesBeratungshilfeFormular,
    testCasesBeratungshilfeFormularGrundvoraussetzungen,
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
    testCasesBeratungshilfeFormularAbgabe,
    testCasesFluggastrechteVerspaetetAbbruch,
    testCasesFluggastrechteAnnullierungAbbruch,
    testCasesFluggastrechteNichtBefoerderungAbbruch,
    testcasesFluggastrechtOtherErfolgs,
    testCasesFluggastrechteFormularPersoenlicheDaten,
    testCasesProzesskostenhilfeFormular,
    testCasesFluggastrechteFormularGrundvoraussetzungen,
    testCasesFluggastrechteFormularStreitwertKosten,
    testCasesProzesskostenhilfePersoenlicheDaten,
    testCasesProzesskostenhilfeRsv,
    testCasesFluggastrechteFormularFlugdatenVerspaetet,
    testCasesFluggastrechteFormularFlugdatenAnnullierung,
    testCasesFluggastrechteErfolg,
    testCasesFluggastrechteErfolgEU,
    testcasesFluggastrechteErfolgAnalog,
    testCasesFluggastrechteFormularProzessfuehrung,
  } as const;
  const transitionTypes = ["SUBMIT", "BACK"] as const;

  describe.concurrent.each(Object.entries(testCases))(
    "%s",
    (_, { machine, cases }) => {
      if (!allVisitedSteps[machine.id]) {
        allVisitedSteps[machine.id] = { machine, stepIds: [] };
      }

      describe.each([...cases])("[%#]", (context, steps) => {
        test.each(transitionTypes)("%s", (transitionType) => {
          const expectedSteps =
            transitionType === "SUBMIT" ? steps : [...steps].reverse();

          const visitedSteps = getEnabledSteps({
            machine,
            context,
            transitionType,
            steps: expectedSteps,
          });

          allVisitedSteps[machine.id].stepIds =
            allVisitedSteps[machine.id].stepIds.concat(visitedSteps);

          expect(visitedSteps).toEqual(expectedSteps);
        });
      });
    },
  );

  // Array pages cannot be tested above since they aren't reachable using the `BACK` transition
  // However, we can still verify that their `SUBMIT` transition is correct
  const forwardOnlyTests = {
    testCasesProzesskostenhilfeForwardOnly,
  };

  describe.concurrent.each(Object.entries(forwardOnlyTests))(
    "%s",
    (_, { machine, cases }) => {
      test.each([...cases])("[%#]", (context, steps) => {
        const visitedSteps = getEnabledSteps({
          machine,
          context,
          transitionType: "SUBMIT",
          steps,
        });

        allVisitedSteps[machine.id].stepIds =
          allVisitedSteps[machine.id].stepIds.concat(visitedSteps);

        expect(visitedSteps).toEqual(steps);
      });
    },
  );

  test("all steps are visited", () => {
    const missingStepsEntries = Object.entries(allVisitedSteps)
      .map(([machineId, { machine, stepIds }]) => {
        const visitedSteps = new Set(stepIds);
        const missingSteps = allStepsFromMachine(machine).filter(
          (x) => !visitedSteps.has(x),
        );
        return [machineId, missingSteps] as const;
      })
      .filter(([_, missingSteps]) => missingSteps.length > 0);

    const totalMissingStepCount = missingStepsEntries.reduce(
      (total, [_, missingSteps]) => total + missingSteps.length,
      0,
    );

    // eslint-disable-next-line no-console
    console.warn(
      `Total of ${totalMissingStepCount} untested stepIds: `,
      Object.fromEntries(missingStepsEntries),
    );
    expect(totalMissingStepCount).toBeLessThanOrEqual(18);
  });
});
