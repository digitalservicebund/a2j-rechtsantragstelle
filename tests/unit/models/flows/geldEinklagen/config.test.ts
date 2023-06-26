import {
  kontaktaufnahmeNoDataFactory,
  fristNoDataFactory,
  verjaehrtYesDataFactory,
  beweiseNoDataFactory,
  happyPathDataFactory,
  gerichtsentscheidungYesDataFactory,
  verfahrenBegonnenYesDataFactory,
} from "tests/factories/flows/geldEinklagenVorabcheckData";
import { createMachine } from "xstate";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";
import { guards } from "~/models/flows/geldEinklagen/guards";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";

const getSteps = (
  machine: ReturnType<typeof createMachine<GeldEinklagenVorabcheckContext>>,
  context: GeldEinklagenVorabcheckContext,
  transitionType: "SUBMIT" | "BACK",
  firstStep: string
) => {
  let returnedSteps = [firstStep];
  while (true) {
    const nextStep = machine.transition(
      returnedSteps.at(-1),
      transitionType,
      context
    );
    if (nextStep.value == returnedSteps.at(-1)) break;
    returnedSteps.push(String(nextStep.value));
  }
  return returnedSteps;
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
  describe("transitions", () => {
    const machine = createMachine<GeldEinklagenVorabcheckContext>(
      { ...geldEinklagenFlow, context: {}, predictableActionArguments: true },
      { guards }
    );

    const kontaktaufnahme = ["start", "kontaktaufnahme"];
    const fristAbgelaufen = [...kontaktaufnahme, "frist-abgelaufen"];
    const verjaehrt = [...fristAbgelaufen, "verjaehrt"];
    const beweise = [...verjaehrt, "beweise"];
    const gerichtsentscheidung = [...beweise, "gerichtsentscheidung"];
    const verfahrenBegonnen = [...gerichtsentscheidung, "verfahren-begonnen"];
    const privatperson = [...verfahrenBegonnen, "privatperson"];
    const wohnsitzDeutschland = [...privatperson, "wohnsitz-deutschland"];
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
        [...kontaktaufnahme, "kontaktaufnahme-hinweis", "frist-abgelaufen"],
      ],
      [
        fristNoDataFactory.build(),
        [...fristAbgelaufen, "frist-abgelaufen-hinweis", "verjaehrt"],
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
        gerichtsentscheidungYesDataFactory.build(),
        [
          ...gerichtsentscheidung,
          "gerichtsentscheidung-hinweis",
          "verfahren-begonnen",
        ],
      ],
      [
        verfahrenBegonnenYesDataFactory.build(),
        [...verfahrenBegonnen, "verfahren-begonnen-hinweis", "privatperson"],
      ],
      [
        happyPathDataFactory.build({ privatperson: "nonPrivate" }),
        [...privatperson, "privatperson-abbruch"],
      ],
      [
        happyPathDataFactory.build({ wohnsitzDeutschland: "no" }),
        [...wohnsitzDeutschland, "wohnsitz-deutschland-abbruch"],
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
      "SUBMIT (%#) given context: %j, visits steps: %j",
      (context, steps) => {
        const expectedSteps = steps;
        const actualSteps = getSteps(
          machine,
          context,
          "SUBMIT",
          expectedSteps[0]
        );
        expect(actualSteps).toEqual(expectedSteps);
      }
    );

    test.each(cases)(
      "BACK (%#) given context: %j, visits steps: %j",
      (context, steps) => {
        const expectedSteps = steps.reverse();
        const actualSteps = getSteps(
          machine,
          context,
          "BACK",
          expectedSteps[0]
        );
        expect(actualSteps).toEqual(expectedSteps);
      }
    );
  });
});
