import { createMachine } from "xstate";
import { happyPathData } from "tests/fixtures/beratungshilfeVorabcheckData";
import { getEnabledSteps } from "tests/unit/models/flows/getEnabledSteps";
import type { BeratungshilfeVorabcheckContext } from "~/models/flows/beratungshilfe/pages";
import { guards } from "~/models/flows/beratungshilfe/guards";
import beratungshilfeFlow from "~/models/flows/beratungshilfe/config.json";

describe("beratungshilfe/config", () => {
  describe("transitions", () => {
    const machine = createMachine<BeratungshilfeVorabcheckContext>(
      { ...beratungshilfeFlow, context: {}, predictableActionArguments: true },
      { guards }
    );

    const rechtsschutzversicherung = ["rechtsschutzversicherung"];
    const wurdeVerklagt = [...rechtsschutzversicherung, "wurde-verklagt"];

    const happyPathSteps = [
      "rechtsschutzversicherung",
      "wurde-verklagt",
      "klage-eingereicht",
      "hamburg-oder-bremen",
      "beratungshilfe-beantragt",
      "eigeninitiative",
      "staatliche-leistungen",
      "vermoegen",
      "erwerbstaetigkeit",
      "partnerschaft",
      "genauigkeit",
      "einkommen",
      "einkommen-partner",
      "kinder",
      "kinder-anzahl",
      "einkommen-kinder",
      "unterhalt",
      "unterhalt-summe",
      "miete",
      "weitere-zahlungen-summe",
      "weitere-zahlungen-summe-abschluss-ja",
    ];

    const cases: [BeratungshilfeVorabcheckContext, string[]][] = [
      [{}, rechtsschutzversicherung],
      [happyPathData, happyPathSteps],

      [
        { ...happyPathData, rechtsschutzversicherung: "yes" },
        ["rechtsschutzversicherung", "rechtsschutzversicherung-abbruch"],
      ],
      [
        { ...happyPathData, wurdeVerklagt: "yes" },
        ["wurde-verklagt", "wurde-verklagt-abbruch"],
      ],
      // TODO more cases
    ];

    test.each(cases)(
      "SUBMIT (%#) given context: %j, visits steps: %j",
      (context, steps) => {
        const expectedSteps = steps;
        const actualSteps = getEnabledSteps(
          machine,
          context,
          "SUBMIT",
          expectedSteps
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
          expectedSteps
        );
        expect(actualSteps).toEqual(expectedSteps);
      }
    );
  });
});
