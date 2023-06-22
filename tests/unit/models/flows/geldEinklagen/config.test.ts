import {
  kontaktaufnahmeYesDataFactory,
  kontaktaufnahmeNoDataFactory,
  fristYesDataFactory,
  fristYesExpiredDataFactory,
  fristNoDataFactory,
  vor2020YesDataFactory,
  vor2020NoDataFactory,
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
    const frist = [...kontaktaufnahme, "frist"];
    const vor2020 = [...frist, "vor-2020"];
    const beweise = [...vor2020, "beweise"];

    const cases: [any, string[]][] = [
      [{}, kontaktaufnahme],
      [kontaktaufnahmeYesDataFactory.build(), frist],
      [
        kontaktaufnahmeNoDataFactory.build(),
        ["kontaktaufnahme", "kontaktaufnahme-hinweis", "frist"],
      ],
      [fristYesExpiredDataFactory.build(), vor2020],
      [fristYesDataFactory.build(), [...frist, "frist-hinweis", "vor-2020"]],
      [fristNoDataFactory.build(), [...frist, "frist-hinweis", "vor-2020"]],
      [
        vor2020YesDataFactory.build(),
        [...vor2020, "vor-2020-hinweis", "beweise"],
      ],
      [vor2020NoDataFactory.build(), beweise],
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
