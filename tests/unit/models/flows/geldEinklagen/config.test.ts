import { happyPathData } from "tests/factories/flows/geldEinklagenVorabcheckData";
import { createMachine } from "xstate";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";
import { guards } from "~/models/flows/geldEinklagen/guards";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";
import { getEnabledSteps } from "tests/unit/models/flows/getEnabledSteps";

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
        { kontaktaufnahme: "no" },
        [...kontaktaufnahme, "kontaktaufnahme-hinweis", "frist-abgelaufen"],
      ],
      [
        { kontaktaufnahme: "yes", fristAbgelaufen: "no" },
        [...fristAbgelaufen, "frist-abgelaufen-hinweis", "verjaehrt"],
      ],
      [
        { kontaktaufnahme: "yes", fristAbgelaufen: "yes", verjaehrt: "yes" },
        [...verjaehrt, "verjaehrt-hinweis", "beweise"],
      ],
      [
        {
          kontaktaufnahme: "yes",
          fristAbgelaufen: "yes",
          verjaehrt: "no",
          beweise: "no",
        },
        [...beweise, "beweise-hinweis", "gerichtsentscheidung"],
      ],
      [
        {
          kontaktaufnahme: "yes",
          fristAbgelaufen: "yes",
          verjaehrt: "no",
          beweise: "yes",
          gerichtsentscheidung: "yes",
        },
        [
          ...gerichtsentscheidung,
          "gerichtsentscheidung-hinweis",
          "verfahren-begonnen",
        ],
      ],
      [
        {
          kontaktaufnahme: "yes",
          fristAbgelaufen: "yes",
          verjaehrt: "no",
          beweise: "yes",
          gerichtsentscheidung: "no",
          verfahrenBegonnen: "yes",
        },
        [...verfahrenBegonnen, "verfahren-begonnen-hinweis", "privatperson"],
      ],
      [
        { ...happyPathData, privatperson: "nonPrivate" },
        [...privatperson, "privatperson-abbruch"],
      ],
      [
        { ...happyPathData, wohnsitzDeutschland: "no" },
        [...wohnsitzDeutschland, "wohnsitz-deutschland-abbruch"],
      ],
      [
        { ...happyPathData, forderung: "moreThan5000" },
        [...forderung, "forderung-abbruch"],
      ],
      [
        { ...happyPathData, bereich: "family" },
        [...bereich, "bereich-familie-abbruch"],
      ],
      [
        { ...happyPathData, bereich: "work" },
        [...bereich, "bereich-arbeit-abbruch"],
      ],
      [{ ...happyPathData, bereich: "travel" }, [...bereich, "flug"]],
      [
        { ...happyPathData, bereich: "travel", flug: "yes" },
        [...bereich, "flug", "flug-abbruch"],
      ],
      [
        { ...happyPathData, gegenseite: "staat" },
        [...gegenseite, "gegenseite-staat-abbruch"],
      ],
      [
        { ...happyPathData, gegenseite: "multiple" },
        [...gegenseite, "gegenseite-mehrere-abbruch"],
      ],
      [
        { ...happyPathData, gegenseite: "unternehmen" },
        [...gegenseite, "gegenseite-unternehmen-deutschland"],
      ],
      [
        { ...happyPathData, gegenseitePersonDeutschland: "no" },
        [
          ...gegenseitePersonDeutschland,
          "gegenseite-person-deutschland-abbruch",
        ],
      ],
      [
        {
          ...happyPathData,
          gegenseite: "unternehmen",
          gegenseiteUnternehmenDeutschland: "no",
        },
        [
          ...gegenseite,
          "gegenseite-unternehmen-deutschland",
          "gegenseite-unternehmen-deutschland-abbruch",
        ],
      ],
      [happyPathData, [...abschluss]],
    ];

    test.each(cases)(
      "SUBMIT (%#) given context: %j, visits steps: %j",
      (context, steps) => {
        const expectedSteps = steps;
        const actualSteps = getEnabledSteps(
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
        const actualSteps = getEnabledSteps(
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
