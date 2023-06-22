import {
  kontaktaufnahmeYesDataFactory,
  kontaktaufnahmeNoDataFactory,
  fristYesDataFactory,
  fristYesExpiredDataFactory,
  fristNoDataFactory,
} from "tests/factories/flows/geldEinklagenVorabcheckData";
import { createMachine } from "xstate";
import { getSimplePaths } from "@xstate/graph";
import { guards } from "~/models/flows/geldEinklagen/guards";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";

const getSteps = (machine: any, context: any) => {
  return Object.values(
    getSimplePaths(machine.withContext(context), {
      events: { SUBMIT: [{ type: "SUBMIT" }] },
    })
  ).map(({ state }) => state.value);
};

/*
 * Note on testing xstate
 *
 * > testing state machines and statecharts should be done
 * > by testing the overall behavior of the machine
 * @see https://xstate.js.org/docs/guides/testing.html
 *
 * - given a current state (context/entered form data)
 * - when some sequence of events occurs (next, next, next)
 * - system under test should be in a certian state (step)
 */

describe("geldEinklagen/config", () => {
  const machine = createMachine(
    //@ts-ignore
    { ...geldEinklagenFlow, context: {}, predictableActionArguments: true },
    //@ts-ignore
    { guards }
  );

  const cases: [any, string[]][] = [
    [{}, ["kontaktaufnahme"]],
    [kontaktaufnahmeYesDataFactory.build(), ["kontaktaufnahme", "frist"]],
    [
      kontaktaufnahmeNoDataFactory.build(),
      ["kontaktaufnahme", "kontaktaufnahme-hinweis", "frist"],
    ],
  ];

  test.each(cases)("(%#) given %j, visits expected steps", (context, steps) => {
    const expectedSteps = steps;
    const actualSteps = getSteps(machine, context);
    expect(actualSteps).toEqual(expectedSteps);
  });
});
