import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";

export const sonstigeNebenUndProzessantraegeTestCases = {
  hasSonstigeNebenUndProzessantraegeComplete: [
    {
      stepId: "/sonstige-neben-und-prozessantraege/uebersicht",
      addArrayItemEvent: "add-sonstigeNebenUndProzessantraege",
    },
    {
      stepId: "/sonstige-neben-und-prozessantraege/antrag/#/daten",
      userInput: {
        "sonstigeNebenUndProzessantraege#internesSchlagwort": "Test Schlagwort",
        "sonstigeNebenUndProzessantraege#antrag": "Test Antrag",
      },
    },
    {
      stepId: "/sonstige-neben-und-prozessantraege/uebersicht",
    },
  ],
  hasSonstigeNebenUndProzessantraegeOptional: [
    {
      stepId: "/sonstige-neben-und-prozessantraege/uebersicht",
      addArrayItemEvent: "add-sonstigeNebenUndProzessantraege",
    },
    {
      stepId: "/sonstige-neben-und-prozessantraege/antrag/#/daten",
      userInput: {
        "sonstigeNebenUndProzessantraege#internesSchlagwort": "",
        "sonstigeNebenUndProzessantraege#antrag": "Test Antrag",
      },
    },
    {
      stepId: "/sonstige-neben-und-prozessantraege/uebersicht",
    },
  ],
} satisfies FlowTestCases<GeldEinklagenAnwaltschaftUserData>;
