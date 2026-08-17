import type { FlowTestConfig } from "~/domains/__test__/TestCases";
import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { verstorbeneTestCases } from "../verstorbene/__test__/testcasesWithUserInput";
import { ausschlagendePersonTestCases } from "../ausschlagendePerson/__test__/testcasesWithUserInput";
import { kinderTestCases } from "../kinder/__test__/testcasesWithUserInput";
import { erbausschlagungAnfrageFlowConfig } from "../flowConfig";

const happyPathData: Partial<NachlassErbausschlagungAnfrageUserData> = {
  pageData: {
    subflowDoneStates: {
      "/ausschlagende-person": true,
    },
  },
  datenverarbeitungZustimmung: "on",
  verstorbeneVorname: "Max",
  verstorbeneNachname: "Mustermann",
  verstorbeneGeburtsdatum: {
    day: "01",
    month: "01",
    year: "1900",
  },
  verstorbeneSterbedatum: {
    day: "01",
    month: "01",
    year: "2020",
  },
  verstorbeneLebensmittelpunkt: "deutschland",
  livedInNursingHome: "no",
  livedInHospice: "no",
  plzVerstorbene: "10969",
  verstorbeneAdresseStrasse: "Musterstraße",
  verstorbeneAdresseHausnummer: "1",
  verstorbeneAdresseOrt: "Musterstadt",
  verstorbeneAdresseZusatz: "",
  awarenessDate: {
    day: "01",
    month: "01",
    year: "2020",
  },
  hasKid: "no",
};

export const nachlassErbausschlagungAnfrageTestCases = {
  xstateConfig: { id: "/nachlass/erbausschlagung/anfrage" },
  newEngineConfig: erbausschlagungAnfrageFlowConfig,
  testcases: {
    defaultStartNachlassErbausschlagungAnfrage: [
      {
        stepId: "/start/start",
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
        stepId: "/abgabe/ende",
      },
    ],
  },
} satisfies FlowTestConfig<
  NachlassErbausschlagungAnfrageUserData,
  typeof erbausschlagungAnfrageFlowConfig.pages
>;
