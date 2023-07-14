/* eslint sonarjs/no-duplicate-string: 0 */
import { createMachine } from "xstate";
import { happyPathData } from "tests/fixtures/beratungshilfeVorabcheckData";
import { guards } from "~/models/flows/beratungshilfe/guards";
import beratungshilfeFlow from "~/models/flows/beratungshilfe/config.json";
import type { BeratungshilfeVorabcheckContext } from "~/models/flows/beratungshilfe/pages";
import type { TestCases } from "../TestCases";

const machine = createMachine<BeratungshilfeVorabcheckContext>(
  { ...beratungshilfeFlow, context: {} },
  { guards },
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
  "ergebnis/weitere-zahlungen-summe-abschluss-ja",
];

const cases = [
  [{}, ["rechtsschutzversicherung"]],
  [happyPathData, happyPathSteps],
  [
    { rechtsschutzversicherung: "yes" },
    ["rechtsschutzversicherung", "ergebnis/rechtsschutzversicherung-abbruch"],
  ],
  [
    { wurdeVerklagt: "yes" },
    ["wurde-verklagt", "ergebnis/wurde-verklagt-abbruch"],
  ],
  [
    { klageEingereicht: "yes" },
    ["klage-eingereicht", "ergebnis/klage-eingereicht-abbruch"],
  ],
  [
    { hamburgOderBremen: "yes" },
    ["hamburg-oder-bremen", "ergebnis/hamburg-oder-bremen-abbruch"],
  ],
  [
    { beratungshilfeBeantragt: "yes" },
    ["beratungshilfe-beantragt", "ergebnis/beratungshilfe-beantragt-abbruch"],
  ],
  [{ eigeninitiative: "no" }, ["eigeninitiative", "eigeninitiative-warnung"]],
  [
    { staatlicheLeistungen: "asylbewerberleistungen" },
    ["staatliche-leistungen", "ergebnis/staatliche-leistungen-abschluss-ja"],
  ],
  [
    { staatlicheLeistungen: "grundsicherung" },
    ["staatliche-leistungen", "ergebnis/staatliche-leistungen-abschluss-ja"],
  ],
  [{ vermoegen: "above_10k" }, ["vermoegen", "ergebnis/vermoegen-abbruch"]],
  [
    { vermoegen: "below_10k", staatlicheLeistungen: "buergergeld" },
    ["vermoegen", "ergebnis/vermoegen-abschluss-ja"],
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
    [
      "verfuegbares-einkommen",
      "ergebnis/verfuegbares-einkommen-abschluss-nein",
    ],
  ],
  [
    { verfuegbaresEinkommen: "no", eigeninitiative: "yes" },
    ["verfuegbares-einkommen", "ergebnis/verfuegbares-einkommen-abschluss-ja"],
  ],
  [
    { verfuegbaresEinkommen: "no", eigeninitiative: "no" },
    [
      "verfuegbares-einkommen",
      "ergebnis/verfuegbares-einkommen-abschluss-vielleicht",
    ],
  ],

  [{ partnerschaft: "no" }, ["einkommen", "kinder"]],
  [{ kinder: "no" }, ["kinder", "unterhalt"]],
  [{ unterhalt: "no" }, ["unterhalt", "miete"]],
  [
    { einkommen: "10000000" },
    [
      "weitere-zahlungen-summe",
      "ergebnis/weitere-zahlungen-summe-abschluss-nein",
    ],
  ],
  [
    { einkommen: "100", eigeninitiative: "no" },
    [
      "weitere-zahlungen-summe",
      "ergebnis/weitere-zahlungen-summe-abschluss-vielleicht",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeVorabcheckContext>;

export const testCasesBeratungshilfe = { machine, cases };
