import { createMachine } from "xstate";
import { happyPathData } from "tests/fixtures/geldEinklagenVorabcheckData";
import { getEnabledSteps } from "tests/unit/models/flows/getEnabledSteps";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";
import { guards } from "~/models/flows/geldEinklagen/guards";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";

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

    const happyPathSteps = [
      "start",
      "kontaktaufnahme",
      "frist-abgelaufen",
      "verjaehrt",
      "beweise",
      "gerichtsentscheidung",
      "verfahren-begonnen",
      "privatperson",
      "wohnsitz-deutschland",
      "forderung",
      "bereich",
      "gegenseite",
      "gegenseite-person-deutschland",
      "ergebnis/abschluss",
    ];

    const cases: [GeldEinklagenVorabcheckContext, string[]][] = [
      [{}, ["start", "kontaktaufnahme"]],
      [
        { kontaktaufnahme: "no" },
        [
          "kontaktaufnahme",
          "ergebnis/kontaktaufnahme-hinweis",
          "frist-abgelaufen",
        ],
      ],
      [
        { fristAbgelaufen: "no" },
        ["frist-abgelaufen", "ergebnis/frist-abgelaufen-hinweis", "verjaehrt"],
      ],
      [
        { verjaehrt: "yes" },
        ["verjaehrt", "ergebnis/verjaehrt-hinweis", "beweise"],
      ],
      [
        { beweise: "no" },
        ["beweise", "ergebnis/beweise-hinweis", "gerichtsentscheidung"],
      ],
      [
        { gerichtsentscheidung: "yes" },
        [
          "gerichtsentscheidung",
          "ergebnis/gerichtsentscheidung-hinweis",
          "verfahren-begonnen",
        ],
      ],
      [
        { verfahrenBegonnen: "yes" },
        [
          "verfahren-begonnen",
          "ergebnis/verfahren-begonnen-hinweis",
          "privatperson",
        ],
      ],
      [
        { privatperson: "nonPrivate" },
        ["privatperson", "ergebnis/privatperson-abbruch"],
      ],
      [
        { wohnsitzDeutschland: "no" },
        ["wohnsitz-deutschland", "ergebnis/wohnsitz-deutschland-abbruch"],
      ],
      [
        { forderung: "moreThan5000" },
        ["forderung", "ergebnis/forderung-abbruch"],
      ],
      [{ bereich: "family" }, ["bereich", "ergebnis/bereich-familie-abbruch"]],
      [{ bereich: "work" }, ["bereich", "ergebnis/bereich-arbeit-abbruch"]],
      [{ bereich: "travel" }, ["bereich", "flug"]],
      [
        { bereich: "travel", flug: "yes" },
        ["bereich", "flug", "ergebnis/flug-abbruch"],
      ],
      [
        { gegenseite: "staat" },
        ["gegenseite", "ergebnis/gegenseite-staat-abbruch"],
      ],
      [
        { gegenseite: "multiple" },
        ["gegenseite", "ergebnis/gegenseite-mehrere-abbruch"],
      ],
      [
        { gegenseite: "unternehmen" },
        ["gegenseite", "gegenseite-unternehmen-deutschland"],
      ],
      [
        { gegenseitePersonDeutschland: "no" },
        [
          "gegenseite-person-deutschland",
          "ergebnis/gegenseite-person-deutschland-abbruch",
        ],
      ],
      [
        {
          gegenseite: "unternehmen",
          gegenseiteUnternehmenDeutschland: "no",
        },
        [
          "gegenseite",
          "gegenseite-unternehmen-deutschland",
          "ergebnis/gegenseite-unternehmen-deutschland-abbruch",
        ],
      ],
      [happyPathData, happyPathSteps],
    ];

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
      }
    );

    test.each(cases)(
      "BACK (%#) given context: %j, visits steps: %j",
      (context, steps) => {
        const expectedSteps = steps.reverse();
        const actualSteps = getEnabledSteps({
          machine,
          context,
          transitionType: "BACK",
          steps: expectedSteps,
        });
        expect(actualSteps).toEqual(expectedSteps);
      }
    );
  });
});
