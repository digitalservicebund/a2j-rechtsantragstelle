import type { ExpectedStep } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

type FluggastrechteStep = ExpectedStep<FluggastrechtVorabcheckUserData>;

export const verspaetetHappyPath = [
  {
    stepId: "/start",
  },
  {
    stepId: "/bereich",
    userInput: { bereich: "verspaetet" },
  },
  {
    stepId: "/verspaetung",
    userInput: { verspaetung: "yes" },
  },
  {
    stepId: "/gruende",
    userInput: { gruende: "yes" },
  },
  {
    stepId: "/gruende-hinweis",
  },
  {
    stepId: "/verjaehrung",
    userInput: { verjaehrung: "yes" },
  },
] satisfies FluggastrechteStep[];

export const fluggastrechteSteps = {
  checkinYes: {
    stepId: "/checkin",
    userInput: { checkin: "yes" },
  },
  kostenlosNo: {
    stepId: "/kostenlos",
    userInput: { kostenlos: "no" },
  },
  rabattNo: {
    stepId: "/rabatt",
    userInput: { rabatt: "no" },
  },
  buchungYes: {
    stepId: "/buchung",
    userInput: { buchung: "yes" },
  },
  abtretungNo: {
    stepId: "/abtretung",
    userInput: { abtretung: "no" },
  },
  entschaedigungYes: {
    stepId: "/entschaedigung",
    userInput: { entschaedigung: "yes" },
  },
  entschaedigungNo: {
    stepId: "/entschaedigung",
    userInput: { entschaedigung: "no" },
  },
  gerichtNo: {
    stepId: "/gericht",
    userInput: { gericht: "no" },
  },
  gerichtYes: {
    stepId: "/gericht",
    userInput: { gericht: "yes" },
  },
} satisfies Record<string, FluggastrechteStep>;

export const anspruchVoraussetzungenHappyPath = [
  fluggastrechteSteps.kostenlosNo,
  fluggastrechteSteps.rabattNo,
  fluggastrechteSteps.buchungYes,
  fluggastrechteSteps.abtretungNo,
] satisfies FluggastrechteStep[];

export const verspaetetAnspruchHappyPath = [
  fluggastrechteSteps.checkinYes,
  ...anspruchVoraussetzungenHappyPath,
] satisfies FluggastrechteStep[];

export const erfolgOhneGerichtHappyPath = [
  ...verspaetetAnspruchHappyPath,
  fluggastrechteSteps.entschaedigungYes,
  fluggastrechteSteps.gerichtNo,
] satisfies FluggastrechteStep[];
