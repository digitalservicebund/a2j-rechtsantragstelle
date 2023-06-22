import {
  kontaktaufnahmeYesDataFactory,
  kontaktaufnahmeNoDataFactory,
  fristYesDataFactory,
  fristNotSetDataFactory,
  fristNoDataFactory,
  verjaehrtNoDataFactory,
  verjaehrtYesDataFactory,
  beweiseNoDataFactory,
  beweiseYesDataFactory,
} from "tests/factories/flows/geldEinklagenVorabcheckData";
import { createMachine } from "xstate";
import { getSimplePaths } from "@xstate/graph";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/guards";
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
  describe("SUBMIT transitions", () => {
    const machine = createMachine<GeldEinklagenVorabcheckContext>(
      { ...geldEinklagenFlow, context: {}, predictableActionArguments: true },
      { guards }
    );

    const kontaktaufnahme = ["kontaktaufnahme"];
    const fristAbgelaufen = [...kontaktaufnahme, "fristAbgelaufen"];
    const verjaehrt = [...fristAbgelaufen, "verjaehrt"];
    const beweise = [...verjaehrt, "beweise"];
    const gerichtsentscheidung = [...beweise, "gerichtsentscheidung"];

    const cases: [GeldEinklagenVorabcheckContext, string[]][] = [
      [{}, kontaktaufnahme],
      [kontaktaufnahmeYesDataFactory.build(), fristAbgelaufen],
      [
        kontaktaufnahmeNoDataFactory.build(),
        ["kontaktaufnahme", "kontaktaufnahme-hinweis", "fristAbgelaufen"],
      ],
      [fristNotSetDataFactory.build(), verjaehrt],
      [fristYesDataFactory.build(), [...fristAbgelaufen, "verjaehrt"]],
      [
        fristNoDataFactory.build(),
        [...fristAbgelaufen, "fristAbgelaufen-hinweis", "verjaehrt"],
      ],
      [
        verjaehrtYesDataFactory.build(),
        [...verjaehrt, "verjaehrt-hinweis", "beweise"],
      ],
      [verjaehrtNoDataFactory.build(), beweise],
      [
        beweiseNoDataFactory.build(),
        [...beweise, "beweise-hinweis", "gerichtsentscheidung"],
      ],
      [beweiseYesDataFactory.build(), gerichtsentscheidung],
    ];

    test.each(cases)(
      "(%#) given context: %j, visits steps: %j",
      (context, steps) => {
        const expectedSteps = steps;
        const actualSteps = getSteps(machine, context);
        expect(actualSteps).toEqual(expectedSteps);
      }
    );
  });
});
