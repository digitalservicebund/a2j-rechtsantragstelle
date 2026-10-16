import { type FlowTestConfig } from "~/domains/__test__/TestCases";
import { geldEinklagenAnwaltschaftFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/flowConfig";
import { klagendeParteiTestCases } from "~/domains/geldEinklagen/anwaltschaft/klagende-partei/__test__/testCasesWithUserInput";
import { beklagteParteiTestCases } from "~/domains/geldEinklagen/anwaltschaft/beklagte-partei/__test__/testCasesWithUserInput";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { sonstigeNebenUndProzessantraegeTestCases } from "../sonstigeNebenUndProzessantraege/__test__/testcasesSonstigeNebenUndProzessantraege";

export const geldEinklagenAnwaltschaftTestCases = {
  flowId: "/geld-einklagen/anwaltschaft",
  newEngineConfig: geldEinklagenAnwaltschaftFlowConfig,
  testcases: {
    basePagesUntilKlagendePartei: [
      {
        stepId: "/voraussetzungen/intro",
      },
      {
        stepId: "/inhalt-klage",
        userInput: {
          zahlungsklageSubjectLine: "Subject",
          zahlungsklageGesamtstreitwert: "1000",
        },
      },
      {
        stepId: "/pilotgericht",
        userInput: {
          pilotgericht: "steinfurt",
        },
      },
    ],
    ...klagendeParteiTestCases,
    ...beklagteParteiTestCases,
    ...sonstigeNebenUndProzessantraegeTestCases,
    rechtlicheWuerdigung: [
      {
        stepId: "/rechtliche-wuerdigung",
        userInput: {
          rechtlicheWuerdigung: "Some kind of Würdigung",
        },
      },
      {
        stepId: "/sonstige-neben-und-prozessantraege/uebersicht",
      },
    ],
  },
} satisfies FlowTestConfig<
  GeldEinklagenAnwaltschaftUserData,
  typeof geldEinklagenAnwaltschaftFlowConfig.pages
>;
