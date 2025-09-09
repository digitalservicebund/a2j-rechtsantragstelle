import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { beratungshilfeVorabcheckXstateConfig } from "../xstateConfig";

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
  },
} satisfies FlowTestCases;
