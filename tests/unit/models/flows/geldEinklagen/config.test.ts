import {
  kontaktaufnahmeNoDataFactory,
  fristNoDataFactory,
  verjaehrtYesDataFactory,
  beweiseNoDataFactory,
  happyPathDataFactory,
} from "tests/factories/flows/geldEinklagenVorabcheckData";
import { createMachine } from "xstate";
import { getSimplePaths } from "@xstate/graph";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";
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

    const kontaktaufnahme = ["start", "kontaktaufnahme"];
    const fristAbgelaufen = [...kontaktaufnahme, "fristAbgelaufen"];
    const verjaehrt = [...fristAbgelaufen, "verjaehrt"];
    const beweise = [...verjaehrt, "beweise"];
    const gerichtsentscheidung = [...beweise, "gerichtsentscheidung"];
    const verfahrenBegonnen = [...gerichtsentscheidung, "verfahrenBegonnen"];
    const privatperson = [...verfahrenBegonnen, "privatperson"];
    const wohnsitzDeutschland = [...privatperson, "wohnsitzDeutschland"];
    const forderung = [...wohnsitzDeutschland, "forderung"];
    const bereich = [...forderung, "bereich"];
    const gegenseite = [...bereich, "gegenseite"];
    const gegenseitePersonDeutschland = [
      ...gegenseite,
      "gegenseite-person-deutschland",
    ];
    const abschluss = [...gegenseitePersonDeutschland, "abschluss"];

    const cases: [GeldEinklagenVorabcheckContext, string[]][] = [
      [{}, kontaktaufnahme],
      [
        kontaktaufnahmeNoDataFactory.build(),
        [...kontaktaufnahme, "kontaktaufnahme-hinweis", "fristAbgelaufen"],
      ],
      [
        fristNoDataFactory.build(),
        [...fristAbgelaufen, "fristAbgelaufen-hinweis", "verjaehrt"],
      ],
      [
        verjaehrtYesDataFactory.build(),
        [...verjaehrt, "verjaehrt-hinweis", "beweise"],
      ],
      [
        beweiseNoDataFactory.build(),
        [...beweise, "beweise-hinweis", "gerichtsentscheidung"],
      ],
      [
        happyPathDataFactory.build({ privatperson: "nonPrivate" }),
        [...privatperson, "privatperson-abbruch"],
      ],
      [
        happyPathDataFactory.build({ wohnsitzDeutschland: "no" }),
        [...wohnsitzDeutschland, "wohnsitzDeutschland-abbruch"],
      ],
      [
        happyPathDataFactory.build({ forderung: "moreThan5000" }),
        [...forderung, "forderung-abbruch"],
      ],
      [
        happyPathDataFactory.build({ bereich: "family" }),
        [...bereich, "bereich-familie-abbruch"],
      ],
      [
        happyPathDataFactory.build({ bereich: "work" }),
        [...bereich, "bereich-arbeit-abbruch"],
      ],
      [happyPathDataFactory.build({ bereich: "travel" }), [...bereich, "flug"]],
      [
        happyPathDataFactory.build({ bereich: "travel", flug: "yes" }),
        [...bereich, "flug", "flug-abbruch"],
      ],
      [
        happyPathDataFactory.build({ gegenseite: "staat" }),
        [...gegenseite, "gegenseite-staat-abbruch"],
      ],
      [
        happyPathDataFactory.build({ gegenseite: "multiple" }),
        [...gegenseite, "gegenseite-mehrere-abbruch"],
      ],
      [
        happyPathDataFactory.build({ gegenseite: "unternehmen" }),
        [...gegenseite, "gegenseite-unternehmen-deutschland"],
      ],
      [
        happyPathDataFactory.build({ gegenseitePersonDeutschland: "no" }),
        [
          ...gegenseitePersonDeutschland,
          "gegenseite-person-deutschland-abbruch",
        ],
      ],
      [
        happyPathDataFactory.build({
          gegenseite: "unternehmen",
          gegenseiteUnternehmenDeutschland: "no",
        }),
        [
          ...gegenseite,
          "gegenseite-unternehmen-deutschland",
          "gegenseite-unternehmen-deutschland-abbruch",
        ],
      ],
      [happyPathDataFactory.build(), [...abschluss]],
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
