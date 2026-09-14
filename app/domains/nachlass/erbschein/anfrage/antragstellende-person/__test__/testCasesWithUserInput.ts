import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { erbscheinAnfrageHappyPathData } from "~/domains/nachlass/erbschein/anfrage/__test__/mockTestData";
import { type ErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

export const antragstellendePersonTestCases: FlowTestCases<ErbscheinAnfrageUserData> =
  {
    singleNationality: [
      {
        stepId: "/antragstellende-person/name",
        userInput: {
          ...erbscheinAnfrageHappyPathData,
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
          antragstellendePersonPlz: "10557",
          antragstellendePersonOrt: "Musterstadt",
          antragstellendePersonLand: "Deutschland",
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
        stepId: "/antragstellende-person/verhaeltnis",
        userInput: {
          antragstellendePersonRelationshipToErblasser: "cousin",
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
          ...erbscheinAnfrageHappyPathData,
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
          ...erbscheinAnfrageHappyPathData,
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
