import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";

export const sonstigeAntraegeTestCases = {
  hasSonstigeAntraegeComplete: [
    {
      stepId: "/sonstige-antraege/uebersicht",
      addArrayItemEvent: "add-sonstigeAntraege",
    },
    {
      stepId: "/sonstige-antraege/antrag/#/daten",
      userInput: {
        "sonstigeAntraege#internesSchlagwort": "Test Schlagwort",
        "sonstigeAntraege#antrag": "Test Antrag",
      },
    },
    {
      stepId: "/sonstige-antraege/uebersicht",
    },
  ],
  hasSonstigeAntraegeOptional: [
    {
      stepId: "/sonstige-antraege/uebersicht",
      addArrayItemEvent: "add-sonstigeAntraege",
    },
    {
      stepId: "/sonstige-antraege/antrag/#/daten",
      userInput: {
        "sonstigeAntraege#internesSchlagwort": "",
        "sonstigeAntraege#antrag": "Test Antrag",
      },
    },
    {
      stepId: "/sonstige-antraege/uebersicht",
    },
    {
      stepId: "/tatsachenvortrag-beweise/uebersicht",
    },
  ],
} satisfies FlowTestCases<GeldEinklagenAnwaltschaftUserData>;
