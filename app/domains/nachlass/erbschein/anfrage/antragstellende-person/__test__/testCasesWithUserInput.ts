import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { nachlassErbscheinAnfrageHappyPathData } from "~/domains/nachlass/erbschein/anfrage/__test__/mockTestData";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

export const antragstellendePersonTestCases: FlowTestCases<NachlassErbscheinAnfrageUserData> =
  {
    singleNationality: [
      {
        stepId: "/antragstellende-person/name",
        userInput: {
          ...nachlassErbscheinAnfrageHappyPathData,
          antragstellendePersonVorname: "Max",
          antragstellendePersonNachname: "Mustermann",
        },
      },
      {
        stepId: "/antragstellende-person/geburtsdatum-ort",
        userInput: {
          antragstellendePersonGeburtsdatum: {
            day: "01",
            month: "01",
            year: "1990",
          },
          antragstellendePersonGeburtsort: "Berlin",
        },
      },
      {
        stepId: "/antragstellende-person/staatsangehoerigkeit",
        userInput: {
          antragstellendePersonStaatsangehoerigkeit: "Amerikanisch",
        },
      },
      {
        stepId: "/antragstellende-person/zweite-staatsangehoerigkeit-frage",
        userInput: {
          antragstellendePersonHasSecondNationality: "no",
        },
      },
      {
        stepId: "/antragstellende-person/anschrift",
        userInput: {
          antragstellendePersonStrasse: "Musterstraße",
          antragstellendePersonHausnummer: "1",
          antragstellendePersonOrt: "Musterstadt",
        },
      },
      {
        stepId: "/antragstellende-person/kontaktdaten",
        userInput: {
          antragstellendePersonTelefonnummer: "49123456789",
          antragstellendePersonEmail: "d8hMz@example.com",
        },
      },
      {
        stepId: "/testament-oder-erbvertrag/art",
      },
    ],
    dualNationality: [
      {
        stepId: "/antragstellende-person/zweite-staatsangehoerigkeit-frage",
        userInput: {
          ...nachlassErbscheinAnfrageHappyPathData,
          antragstellendePersonHasSecondNationality: "yes",
        },
      },
      {
        stepId: "/antragstellende-person/zweite-staatsangehoerigkeit",
        userInput: {
          antragstellendePersonZweiteStaatsangehoerigkeit: "oesterreichisch",
        },
      },
      {
        stepId: "/antragstellende-person/dritte-staatsangehoerigkeit-frage",
        userInput: {
          antragstellendePersonHasThirdNationality: "no",
        },
      },
      {
        stepId: "/antragstellende-person/anschrift",
      },
    ],
    tripleNationality: [
      {
        stepId: "/antragstellende-person/dritte-staatsangehoerigkeit-frage",
        userInput: {
          ...nachlassErbscheinAnfrageHappyPathData,
          antragstellendePersonHasSecondNationality: "yes",
          antragstellendePersonHasThirdNationality: "yes",
        },
      },
      {
        stepId: "/antragstellende-person/dritte-staatsangehoerigkeit",
        userInput: {
          antragstellendePersonDritteStaatsangehoerigkeit: "franzoesisch",
        },
      },
      {
        stepId: "/antragstellende-person/anschrift",
      },
    ],
  };
