import type { FlowTestConfig } from "~/domains/__test__/TestCases";
import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { verstorbeneTestCases } from "../verstorbene/__test__/testcasesWithUserInput";
import { ausschlagendePersonTestCases } from "../ausschlagendePerson/__test__/testcasesWithUserInput";
import { kinderTestCases } from "../kinder/__test__/testcasesWithUserInput";
import { erbausschlagungAnfrageFlowConfig } from "../flowConfig";
import { happyPathData } from "./testcaseData";

export const nachlassErbausschlagungAnfrageTestCases = {
  xstateConfig: { id: "/nachlass/erbausschlagung/anfrage" },
  newEngineConfig: erbausschlagungAnfrageFlowConfig,
  testcases: {
    defaultStartNachlassErbausschlagungAnfrage: [
      {
        stepId: "/start/start",
      },
      {
        stepId: "/start/gerichtstermin-bestaetigt",
        userInput: {
          gerichtsterminBestaetigt: "yes",
        },
      },
      {
        stepId: "/start/datenverarbeitung",
        userInput: {
          datenverarbeitungZustimmung: "on",
        },
      },
      {
        stepId: "/verstorbene/name",
      },
    ],
    withoutGerichtstermin: [
      {
        stepId: "/start/start",
      },
      {
        stepId: "/start/gerichtstermin-bestaetigt",
        userInput: {
          gerichtsterminBestaetigt: "no",
        },
      },
      {
        stepId: "/start/gerichtstermin-vereinbaren",
      },
    ],
    ...verstorbeneTestCases,
    ...ausschlagendePersonTestCases,
    ...kinderTestCases,
    abgabe: [
      {
        stepId: "/abgabe/weitere-informationen",
        userInput: {
          ...happyPathData,
          weitereInformationen: "Hier sind weitere Informationen.",
        },
      },
      {
        stepId: "/abgabe/zusammenfassung",
      },
      {
        stepId: "/abgabe/bestaetigung",
        userInput: {
          persoenlichZumGerichtGehen: "on",
          fristErbausschlagung: "on",
          erbausschlagungDokument: "on",
        },
      },
      {
        stepId: "/abgabe/ende",
      },
    ],
  },
} satisfies FlowTestConfig<
  NachlassErbausschlagungAnfrageUserData,
  typeof erbausschlagungAnfrageFlowConfig.pages
>;
