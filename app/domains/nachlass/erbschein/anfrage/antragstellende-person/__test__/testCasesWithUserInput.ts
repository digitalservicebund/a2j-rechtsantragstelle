import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const happyPathData: NachlassErbscheinAnfrageUserData = {
  datenverarbeitungZustimmung: "on",
  verstorbenePersonStrasse: "Musterstraße",
  verstorbenePersonHausnummer: "1",
  verstorbenePersonOrt: "Musterstadt",
};

export const antragstellendePersonTestCases: FlowTestCases<NachlassErbscheinAnfrageUserData> =
  {
    singleNationality: [
      {
        stepId: "/antragstellende-person/name",
        userInput: {
          ...happyPathData,
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
          ...happyPathData,
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
          ...happyPathData,
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
