import type { FlowId } from "~/domains/flowIds";
import type { UserData } from "~/domains/userData";

type FlowTest = {
  existingUserData?: UserData;
  flowId: FlowId;
  expectedSteps: Array<{
    url: string;
    userInput?: UserData;
  }>;
};

export const beratungshilfeVorabcheckE2E = {
  flowId: "/beratungshilfe/vorabcheck",
  expectedSteps: [
    { url: "/start" },
    {
      url: "/rechtsschutzversicherung",
      userInput: { rechtsschutzversicherung: "no" },
    },
    {
      url: "/wurde-verklagt",
      userInput: { wurdeVerklagt: "no" },
    },
    {
      url: "/klage-eingereicht",
      userInput: { klageEingereicht: "no" },
    },
    {
      url: "/hamburg-oder-bremen",
      userInput: { hamburgOderBremen: "no" },
    },
    {
      url: "/beratungshilfe-beantragt",
      userInput: { beratungshilfeBeantragt: "no" },
    },
    {
      url: "/eigeninitiative",
      userInput: { eigeninitiative: "no" },
    },

    { url: "/eigeninitiative-warnung" },
    {
      url: "/bereich",
      userInput: { bereich: "other" },
    },
    {
      url: "/staatliche-leistungen",
      userInput: { staatlicheLeistungen: "keine" },
    },
    {
      url: "/vermoegen",
      userInput: { vermoegen: "below_10k" },
    },
    {
      url: "/erwerbstaetigkeit",
      userInput: { erwerbstaetigkeit: "no" },
    },
    {
      url: "/partnerschaft",
      userInput: { partnerschaft: "no" },
    },
    {
      url: "/genauigkeit",
      userInput: { genauigkeit: "no" },
    },
    {
      url: "/kinder-kurz",
      userInput: { kinderKurz: "yes" },
    },
    {
      url: "/kinder-anzahl-kurz",
      userInput: { kinderAnzahlKurz: "5" },
    },
    {
      url: "/verfuegbares-einkommen",
      userInput: { verfuegbaresEinkommen: "yes" },
    },
    { url: "/ergebnis/verfuegbares-einkommen-abschluss-nein" },
  ],
} satisfies FlowTest;
