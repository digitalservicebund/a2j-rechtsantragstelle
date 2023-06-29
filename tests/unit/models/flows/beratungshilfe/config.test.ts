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
      [{}, ["rechtsschutzversicherung"]],
      [happyPathData, happyPathSteps],
      [
        { rechtsschutzversicherung: "yes" },
        ["rechtsschutzversicherung", "rechtsschutzversicherung-abbruch"],
      ],
      [{ wurdeVerklagt: "yes" }, ["wurde-verklagt", "wurde-verklagt-abbruch"]],
      [
        { klageEingereicht: "yes" },
        ["klage-eingereicht", "klage-eingereicht-abbruch"],
      ],
      [
        { hamburgOderBremen: "yes" },
        ["hamburg-oder-bremen", "hamburg-oder-bremen-abbruch"],
      ],
      [
        { beratungshilfeBeantragt: "yes" },
        ["beratungshilfe-beantragt", "beratungshilfe-beantragt-abbruch"],
      ],
      [
        { eigeninitiative: "no" },
        ["eigeninitiative", "eigeninitiative-warnung"],
      ],
      [
        { staatlicheLeistungen: "asylbewerberleistungen" },
        ["staatliche-leistungen", "staatliche-leistungen-abschluss-ja"],
      ],
      [
        { staatlicheLeistungen: "grundsicherung" },
        ["staatliche-leistungen", "staatliche-leistungen-abschluss-ja"],
      ],
      [{ vermoegen: "above_10k" }, ["vermoegen", "vermoegen-abbruch"]],
      [
        { vermoegen: "below_10k", staatlicheLeistungen: "buergergeld" },
        ["vermoegen", "vermoegen-abschluss-ja"],
      ],
      [{ genauigkeit: "no" }, ["genauigkeit", "kinder-kurz"]],
      [{ kinderKurz: "yes" }, ["kinder-kurz", "kinder-anzahl-kurz"]],
      [{ kinderKurz: "no" }, ["kinder-kurz", "verfuegbares-einkommen"]],
      [
        { kinderAnzahlKurz: "1", kinderKurz: "yes" },
        ["kinder-anzahl-kurz", "verfuegbares-einkommen"],
      ],
      [
        { verfuegbaresEinkommen: "yes" },
        ["verfuegbares-einkommen", "verfuegbares-einkommen-abschluss-nein"],
      ],
      [
        { verfuegbaresEinkommen: "no", eigeninitiative: "yes" },
        ["verfuegbares-einkommen", "verfuegbares-einkommen-abschluss-ja"],
      ],
      [
        { verfuegbaresEinkommen: "no", eigeninitiative: "no" },
        [
          "verfuegbares-einkommen",
          "verfuegbares-einkommen-abschluss-vielleicht",
        ],
      ],
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
        console.log(actualSteps);
        expect(actualSteps).toEqual(expectedSteps);
      }
    );
  });
});
