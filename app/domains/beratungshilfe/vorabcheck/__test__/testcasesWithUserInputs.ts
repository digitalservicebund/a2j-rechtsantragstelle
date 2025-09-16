import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { beratungshilfeVorabcheckXstateConfig } from "../xstateConfig";

const rsvTestCases = {
  rsvYes: [
    {
      stepId: "/rechtsschutzversicherung-details",
      userInput: { rsvCoverage: "yes" },
    },
    { stepId: "/ergebnis/rechtsschutzversicherung-abbruch" },
  ],
  rsvTooExpensive: [
    {
      stepId: "/rechtsschutzversicherung-details",
      userInput: { rsvCoverage: "tooExpensive" },
    },
    {
      stepId: "/rechtsschutzversicherung-hinweis-selbstbeteiligung",
    },
  ],
  rsvUnknown: [
    {
      stepId: "/rechtsschutzversicherung-details",
      userInput: { rsvCoverage: "unknown" },
    },
    {
      stepId: "/ergebnis/rechtsschutzversicherung-ungewiss-abbruch",
    },
  ],
  rsvNone: [
    {
      stepId: "/rechtsschutzversicherung-details",
      userInput: { rsvCoverage: "no" },
    },
    {
      stepId: "/rechtsschutzversicherung-hinweis-kostenuebernahme",
    },
  ],
  rsvPartly: [
    {
      stepId: "/rechtsschutzversicherung-details",
      userInput: { rsvCoverage: "partly" },
    },
    {
      stepId: "/rechtsschutzversicherung-hinweis-kostenuebernahme",
    },
  ],
} satisfies FlowTestCases["testcases"];

const staatlicheLeistungenTestCases = {
  asylbewerberleistungen: [
    {
      stepId: "/staatliche-leistungen",
      userInput: { staatlicheLeistungen: "asylbewerberleistungen" },
    },
    { stepId: "/ergebnis/staatliche-leistungen-abschluss-ja" },
  ],
  asylbewerberleistungenEigeninitiativeNo: [
    {
      stepId: "/staatliche-leistungen",
      userInput: {
        staatlicheLeistungen: "asylbewerberleistungen",
        eigeninitiative: "no",
      },
    },
    { stepId: "/ergebnis/staatliche-leistungen-abschluss-vielleicht" },
  ],
  grundsicherung: [
    {
      stepId: "/staatliche-leistungen",
      userInput: { staatlicheLeistungen: "grundsicherung" },
    },
    { stepId: "/ergebnis/staatliche-leistungen-abschluss-ja" },
  ],
  grundsicherungEigeninitiativeNo: [
    {
      stepId: "/staatliche-leistungen",
      userInput: {
        staatlicheLeistungen: "grundsicherung",
        eigeninitiative: "no",
      },
    },
    { stepId: "/ergebnis/staatliche-leistungen-abschluss-vielleicht" },
  ],
  buergergeld: [
    {
      stepId: "/staatliche-leistungen",
      userInput: { staatlicheLeistungen: "buergergeld" },
    },
    {
      stepId: "/vermoegen",
      userInput: { vermoegen: "below_10k", eigeninitiative: "no" },
    },
    { stepId: "/ergebnis/vermoegen-abschluss-vielleicht" },
  ],
} satisfies FlowTestCases["testcases"];

export const beratungshilfeVorabcheckTestCases = {
  xstateConfig: beratungshilfeVorabcheckXstateConfig,
  testcases: {
    fullFlow: [
      { stepId: "/start" },
      {
        stepId: "/rechtsschutzversicherung",
        userInput: { rechtsschutzversicherung: "no" },
      },
      {
        stepId: "/wurde-verklagt",
        userInput: { wurdeVerklagt: "no" },
      },
      {
        stepId: "/klage-eingereicht",
        userInput: { klageEingereicht: "no" },
      },
      {
        stepId: "/hamburg-oder-bremen",
        userInput: { hamburgOderBremen: "no" },
      },
      {
        stepId: "/beratungshilfe-beantragt",
        userInput: { beratungshilfeBeantragt: "no" },
      },
      {
        stepId: "/eigeninitiative",
        userInput: { eigeninitiative: "no" },
      },
      { stepId: "/eigeninitiative-warnung" },
      {
        stepId: "/bereich",
        userInput: { bereich: "other" },
      },
      {
        stepId: "/staatliche-leistungen",
        userInput: { staatlicheLeistungen: "keine" },
      },
      {
        stepId: "/vermoegen",
        userInput: { vermoegen: "below_10k" },
      },
      {
        stepId: "/erwerbstaetigkeit",
        userInput: { erwerbstaetigkeit: "no" },
      },
      {
        stepId: "/partnerschaft",
        userInput: { partnerschaft: "no" },
      },
      {
        stepId: "/genauigkeit",
        userInput: { genauigkeit: "no" },
      },
      {
        stepId: "/kinder-kurz",
        userInput: { kinderKurz: "yes" },
      },
      {
        stepId: "/kinder-anzahl-kurz",
        userInput: { kinderAnzahlKurz: "5" },
      },
      {
        stepId: "/verfuegbares-einkommen",
        userInput: { verfuegbaresEinkommen: "yes" },
      },
      { stepId: "/ergebnis/verfuegbares-einkommen-abschluss-nein" },
    ],
    ...rsvTestCases,
    wurdeVerklagt: [
      { stepId: "/wurde-verklagt", userInput: { wurdeVerklagt: "yes" } },
      { stepId: "/ergebnis/wurde-verklagt-abbruch" },
    ],
    klageEingereicht: [
      { stepId: "/klage-eingereicht", userInput: { klageEingereicht: "yes" } },
      { stepId: "/ergebnis/klage-eingereicht-abbruch" },
    ],
    hamburgBremen: [
      {
        stepId: "/hamburg-oder-bremen",
        userInput: { hamburgOderBremen: "yes" },
      },
      { stepId: "/ergebnis/hamburg-oder-bremen-abbruch" },
    ],
    schonBeantragt: [
      {
        stepId: "/beratungshilfe-beantragt",
        userInput: { beratungshilfeBeantragt: "yes" },
      },
      { stepId: "/ergebnis/beratungshilfe-beantragt-abbruch" },
    ],
    eigeninitiative: [
      { stepId: "/eigeninitiative", userInput: { eigeninitiative: "no" } },
      { stepId: "/eigeninitiative-warnung" },
      { stepId: "/bereich" },
    ],
    ...staatlicheLeistungenTestCases,
    vermoegenAbove10k: [
      { stepId: "/vermoegen", userInput: { vermoegen: "above_10k" } },
      { stepId: "/ergebnis/vermoegen-abbruch" },
    ],
    vermoegenBelow10k: [
      {
        stepId: "/vermoegen",
        userInput: {
          vermoegen: "below_10k",
          staatlicheLeistungen: "buergergeld",
        },
      },
      { stepId: "/ergebnis/vermoegen-abschluss-ja" },
    ],
    genauigkeitNein: [
      { stepId: "/genauigkeit", userInput: { genauigkeit: "no" } },
      { stepId: "/kinder-kurz" },
    ],
    kinderKurzYes: [
      { stepId: "/kinder-kurz", userInput: { kinderKurz: "yes" } },
      { stepId: "/kinder-anzahl-kurz" },
    ],
    kinderKurzNo: [
      { stepId: "/kinder-kurz", userInput: { kinderKurz: "no" } },
      { stepId: "/verfuegbares-einkommen" },
    ],
    kinderAnzahl: [
      {
        stepId: "/kinder-anzahl-kurz",
        userInput: { kinderAnzahlKurz: "1", kinderKurz: "yes" },
      },
      { stepId: "/verfuegbares-einkommen" },
    ],
    verfugbaresEinkommenYes: [
      {
        stepId: "/verfuegbares-einkommen",
        userInput: { verfuegbaresEinkommen: "yes" },
      },
      { stepId: "/ergebnis/verfuegbares-einkommen-abschluss-nein" },
    ],
    verfugbaresEinkommenNoEigeninitiativeYes: [
      {
        stepId: "/verfuegbares-einkommen",
        userInput: { verfuegbaresEinkommen: "no", eigeninitiative: "yes" },
      },
      { stepId: "/ergebnis/verfuegbares-einkommen-abschluss-ja" },
    ],
    verfugbaresEinkommenNoEigeninitiativeNo: [
      {
        stepId: "/verfuegbares-einkommen",
        userInput: { verfuegbaresEinkommen: "no", eigeninitiative: "no" },
      },
      { stepId: "/ergebnis/verfuegbares-einkommen-abschluss-vielleicht" },
    ],
    partnerschaftNo: [
      {
        stepId: "/einkommen",
        userInput: { partnerschaft: "no", einkommen: "0" },
      },
      { stepId: "/kinder" },
    ],
    kinderNo: [
      {
        stepId: "/kinder",
        userInput: { kinder: "no" },
      },
      { stepId: "/unterhalt" },
    ],
    unterhaltNo: [
      {
        stepId: "/unterhalt",
        userInput: { unterhalt: "no" },
      },
      { stepId: "/miete" },
    ],
    einkommenHoch: [
      {
        stepId: "/weitere-zahlungen-summe",
        userInput: { einkommen: "10000000", weitereZahlungenSumme: "0" },
      },
      {
        stepId: "/ergebnis/weitere-zahlungen-summe-abschluss-nein",
      },
    ],
    weitereZahlungenHoch: [
      {
        stepId: "/weitere-zahlungen-summe",
        userInput: { einkommen: "0", weitereZahlungenSumme: "100000" },
      },
      {
        stepId: "/ergebnis/weitere-zahlungen-summe-abschluss-ja",
      },
    ],
    einkommenBalanced: [
      {
        stepId: "/weitere-zahlungen-summe",
        userInput: {
          einkommen: "100",
          weitereZahlungenSumme: "100",
          eigeninitiative: "no",
        },
      },
      {
        stepId: "/ergebnis/weitere-zahlungen-summe-abschluss-vielleicht",
      },
    ],
  },
} satisfies FlowTestCases;
