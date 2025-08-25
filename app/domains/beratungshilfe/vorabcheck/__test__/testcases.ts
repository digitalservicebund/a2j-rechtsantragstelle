/* eslint sonarjs/no-duplicate-string: 0 */
import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { happyPathData } from "~/domains/beratungshilfe/vorabcheck/__test__/beratungshilfeVorabcheckData";
import type { BeratungshilfeVorabcheckUserData } from "~/domains/beratungshilfe/vorabcheck/userData";
import { beratungshilfeVorabcheckXstateConfig } from "~/domains/beratungshilfe/vorabcheck/xstateConfig";
import type { FlowStateMachine } from "~/services/flow/server/types";

const happyPathSteps = [
  "/start",
  "/rechtsschutzversicherung",
  "/wurde-verklagt",
  "/klage-eingereicht",
  "/hamburg-oder-bremen",
  "/beratungshilfe-beantragt",
  "/eigeninitiative",
  "/bereich",
  "/staatliche-leistungen",
  "/vermoegen",
  "/erwerbstaetigkeit",
  "/partnerschaft",
  "/genauigkeit",
  "/einkommen",
  "/einkommen-partner",
  "/kinder",
  "/kinder-anzahl",
  "/einkommen-kinder",
  "/unterhalt",
  "/unterhalt-summe",
  "/miete",
  "/weitere-zahlungen-summe",
  "/ergebnis/weitere-zahlungen-summe-abschluss-ja",
];

const cases = [
  [{}, ["/start"]],
  [happyPathData, happyPathSteps],
  [
    { rsvCoverage: "yes" },
    [
      "/rechtsschutzversicherung-details",
      "/ergebnis/rechtsschutzversicherung-abbruch",
    ],
  ],
  [
    { rsvCoverage: "tooExpensive" },
    [
      "/rechtsschutzversicherung-details",
      "/rechtsschutzversicherung-hinweis-selbstbeteiligung",
    ],
  ],
  [
    { rsvCoverage: "unknown" },
    [
      "/rechtsschutzversicherung-details",
      "/ergebnis/rechtsschutzversicherung-ungewiss-abbruch",
    ],
  ],
  [
    { rsvCoverage: "no" },
    [
      "/rechtsschutzversicherung-details",
      "/rechtsschutzversicherung-hinweis-kostenuebernahme",
    ],
  ],
  [
    { rsvCoverage: "partly" },
    [
      "/rechtsschutzversicherung-details",
      "/rechtsschutzversicherung-hinweis-kostenuebernahme",
    ],
  ],
  [
    { wurdeVerklagt: "yes" },
    ["/wurde-verklagt", "/ergebnis/wurde-verklagt-abbruch"],
  ],
  [
    { klageEingereicht: "yes" },
    ["/klage-eingereicht", "/ergebnis/klage-eingereicht-abbruch"],
  ],
  [
    { hamburgOderBremen: "yes" },
    ["/hamburg-oder-bremen", "/ergebnis/hamburg-oder-bremen-abbruch"],
  ],
  [
    { beratungshilfeBeantragt: "yes" },
    ["/beratungshilfe-beantragt", "/ergebnis/beratungshilfe-beantragt-abbruch"],
  ],
  [
    { eigeninitiative: "no" },
    ["/eigeninitiative", "/eigeninitiative-warnung", "/bereich"],
  ],
  [
    { staatlicheLeistungen: "asylbewerberleistungen" },
    ["/staatliche-leistungen", "/ergebnis/staatliche-leistungen-abschluss-ja"],
  ],
  [
    { staatlicheLeistungen: "grundsicherung" },
    ["/staatliche-leistungen", "/ergebnis/staatliche-leistungen-abschluss-ja"],
  ],
  [
    { staatlicheLeistungen: "grundsicherung", eigeninitiative: "no" },
    [
      "/staatliche-leistungen",
      "/ergebnis/staatliche-leistungen-abschluss-vielleicht",
    ],
  ],
  [
    { staatlicheLeistungen: "asylbewerberleistungen", eigeninitiative: "no" },
    [
      "/staatliche-leistungen",
      "/ergebnis/staatliche-leistungen-abschluss-vielleicht",
    ],
  ],
  [
    {
      staatlicheLeistungen: "buergergeld",
      vermoegen: "below_10k",
      eigeninitiative: "no",
    },
    [
      "/staatliche-leistungen",
      "/vermoegen",
      "/ergebnis/vermoegen-abschluss-vielleicht",
    ],
  ],
  [{ vermoegen: "above_10k" }, ["/vermoegen", "/ergebnis/vermoegen-abbruch"]],
  [
    { vermoegen: "below_10k", staatlicheLeistungen: "buergergeld" },
    ["/vermoegen", "/ergebnis/vermoegen-abschluss-ja"],
  ],
  [{ genauigkeit: "no" }, ["/genauigkeit", "/kinder-kurz"]],

  [{ kinderKurz: "yes" }, ["/kinder-kurz", "/kinder-anzahl-kurz"]],
  [{ kinderKurz: "no" }, ["/kinder-kurz", "/verfuegbares-einkommen"]],
  [
    { kinderAnzahlKurz: "1", kinderKurz: "yes" },
    ["/kinder-anzahl-kurz", "/verfuegbares-einkommen"],
  ],
  [
    { verfuegbaresEinkommen: "yes" },
    [
      "/verfuegbares-einkommen",
      "/ergebnis/verfuegbares-einkommen-abschluss-nein",
    ],
  ],
  [
    { verfuegbaresEinkommen: "no", eigeninitiative: "yes" },
    [
      "/verfuegbares-einkommen",
      "/ergebnis/verfuegbares-einkommen-abschluss-ja",
    ],
  ],
  [
    { verfuegbaresEinkommen: "no", eigeninitiative: "no" },
    [
      "/verfuegbares-einkommen",
      "/ergebnis/verfuegbares-einkommen-abschluss-vielleicht",
    ],
  ],

  [{ partnerschaft: "no", einkommen: "0" }, ["/einkommen", "/kinder"]],
  [{ kinder: "no" }, ["/kinder", "/unterhalt"]],
  [{ unterhalt: "no" }, ["/unterhalt", "/miete"]],
  [
    { einkommen: "10000000", weitereZahlungenSumme: "0" },
    [
      "/weitere-zahlungen-summe",
      "/ergebnis/weitere-zahlungen-summe-abschluss-nein",
    ],
  ],
  [
    { einkommen: "0", weitereZahlungenSumme: "100000" },
    [
      "/weitere-zahlungen-summe",
      "/ergebnis/weitere-zahlungen-summe-abschluss-ja",
    ],
  ],
  [
    { einkommen: "100", weitereZahlungenSumme: "100", eigeninitiative: "no" },
    [
      "/weitere-zahlungen-summe",
      "/ergebnis/weitere-zahlungen-summe-abschluss-vielleicht",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeVorabcheckUserData>;

const machine: FlowStateMachine = createMachine(
  beratungshilfeVorabcheckXstateConfig,
);
export const testCasesBeratungshilfeVorabcheck = { machine, cases };
