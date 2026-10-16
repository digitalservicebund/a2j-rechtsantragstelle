import { type FlowTestConfig } from "~/domains/__test__/TestCases";
import { geldEinklagenAnwaltschaftFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/flowConfig";
import { klagendeParteiTestCases } from "~/domains/geldEinklagen/anwaltschaft/klagende-partei/__test__/testCasesWithUserInput";
import { beklagteParteiTestCases } from "~/domains/geldEinklagen/anwaltschaft/beklagte-partei/__test__/testCasesWithUserInput";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { hauptUndNebenantraegeTestCases } from "../hauptUndNebenantraege/__test__/tescaseWithUserInput";

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
    rechtlicheWuerdigung: [
      {
        stepId: "/rechtliche-wuerdigung",
        userInput: {
          rechtlicheWuerdigung: "Some kind of Würdigung",
        },
      },
      {
        stepId: "/haupt-und-nebenantraege/sonstige-neben-und-prozessantraege/uebersicht",
      },
    ],
    ...beklagteParteiTestCases,
    ...hauptUndNebenantraegeTestCases,
  },
} satisfies FlowTestConfig<GeldEinklagenAnwaltschaftUserData>;
