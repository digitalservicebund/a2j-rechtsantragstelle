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

    const cases: [BeratungshilfeVorabcheckContext, string[]][] = [
      [{}, rechtsschutzversicherung],
      [happyPathData, wurdeVerklagt], // TODO
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
