import type { ExpectedStep, FlowTestCases } from "~/domains/__test__/TestCases";
import type { NachlassErbausschlagungAnfrageUserData } from "../../userData";

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
};

const defaultStepsWithKidsUnderAge: Array<
  ExpectedStep<NachlassErbausschlagungAnfrageUserData>
> = [
  {
    stepId: "/kinder/haben-sie-kinder",
    userInput: {
      ...happyPathData,
      hasKid: "yes",
    },
  },
  {
    stepId: "/kinder/wie-viele-kinder",
    userInput: {
      numberOfKids: 1,
    },
  },
  {
    stepId: "/kinder/uebersicht",
    addArrayItemEvent: "add-kinder",
  },
  {
    stepId: "/kinder/kinder/#/name",
    userInput: {
      "kinder#vorname": "Clara",
      "kinder#nachname": "Mustermann",
      "kinder#geburtsdatum": {
        day: "01",
        month: "01",
        year: "2024",
      },
    },
  },
  {
    stepId: "/kinder/kinder/#/wohnort",
    userInput: {
      "kinder#wohnortBeiAntragsteller": "yes",
    },
  },
];

export const kinderTestCases: FlowTestCases<NachlassErbausschlagungAnfrageUserData> =
  {
    withoutKids: [
      {
        stepId: "/kinder/haben-sie-kinder",
        userInput: {
          ...happyPathData,
          hasKid: "no",
        },
      },
      {
        stepId: "/abgabe/weitere-informationen",
      },
    ],
    withKidsAndWarning: [
      {
        stepId: "/kinder/haben-sie-kinder",
        userInput: {
          ...happyPathData,
          hasKid: "yes",
        },
      },
      {
        stepId: "/kinder/wie-viele-kinder",
        userInput: {
          numberOfKids: 1,
        },
      },
      {
        stepId: "/kinder/uebersicht",
      },
      {
        stepId: "/kinder/warnung",
      },
    ],
    withKidsAndOverAgeWithoutAdresse: [
      {
        stepId: "/kinder/haben-sie-kinder",
        userInput: {
          ...happyPathData,
          hasKid: "yes",
        },
      },
      {
        stepId: "/kinder/wie-viele-kinder",
        userInput: {
          numberOfKids: 1,
        },
      },
      {
        stepId: "/kinder/uebersicht",
        addArrayItemEvent: "add-kinder",
      },
      {
        stepId: "/kinder/kinder/#/name",
        userInput: {
          "kinder#vorname": "Clara",
          "kinder#nachname": "Mustermann",
          "kinder#geburtsdatum": {
            day: "01",
            month: "01",
            year: "2000",
          },
        },
      },
      {
        stepId: "/kinder/kinder/#/wohnort",
        userInput: {
          "kinder#wohnortBeiAntragsteller": "no",
        },
      },
      {
        stepId: "/kinder/kinder/#/adresse-optional",
        userInput: {
          "kinder#strasse": "street",
          "kinder#hausnummer": "1",
          "kinder#plz": "10969",
          "kinder#ort": "Musterstadt",
        },
      },
      {
        stepId: "/kinder/uebersicht",
      },
      {
        stepId: "/abgabe/weitere-informationen",
      },
    ],
    withKidsAndUnderAgeWithoutAdresse: [
      {
        stepId: "/kinder/haben-sie-kinder",
        userInput: {
          ...happyPathData,
          hasKid: "yes",
        },
      },
      {
        stepId: "/kinder/wie-viele-kinder",
        userInput: {
          numberOfKids: 1,
        },
      },
      {
        stepId: "/kinder/uebersicht",
        addArrayItemEvent: "add-kinder",
      },
      {
        stepId: "/kinder/kinder/#/name",
        userInput: {
          "kinder#vorname": "Clara",
          "kinder#nachname": "Mustermann",
          "kinder#geburtsdatum": {
            day: "01",
            month: "01",
            year: "2024",
          },
        },
      },
      {
        stepId: "/kinder/kinder/#/wohnort",
        userInput: {
          "kinder#wohnortBeiAntragsteller": "no",
        },
      },
      {
        stepId: "/kinder/kinder/#/adresse",
        userInput: {
          "kinder#strasse": "street",
          "kinder#hausnummer": "1",
          "kinder#plz": "10969",
          "kinder#ort": "Musterstadt",
        },
      },
      {
        stepId: "/kinder/kinder/#/sorgerecht",
      },
    ],
    withKidsAndUnderAgeWithAdresseAndSorgerechtYes: [
      ...defaultStepsWithKidsUnderAge,
      {
        stepId: "/kinder/#/sorgerecht",
        userInput: {
          "kinder#optionSorgerecht": "yes",
        },
      },
      {
        stepId: "/kinder/#/erbe-ausschlagende",
        userInput: {
          "kinder#hasRenouncedInheritance": "yes",
        },
      },
      {
        stepId: "/kinder/uebersicht",
      },
      {
        stepId: "/abgabe/weitere-informationen",
      },
    ],
    withKidsAndUnderAgeWithAdresseAndSorgerechtOrganization: [
      ...defaultStepsWithKidsUnderAge,
      {
        stepId: "/kinder/#/sorgerecht",
        userInput: {
          "kinder#optionSorgerecht": "anotherOrganization",
        },
      },
      {
        stepId: "/kinder/#/sorgerecht-organisation-name",
        userInput: {
          "kinder#organizationNameSorgerecht": "organizationNameSorgerecht",
        },
      },
      {
        stepId: "/kinder/#/sorgerecht-organisation-adresse",
        userInput: {
          "kinder#organizationStrasseSorgerecht": "Musterstraße",
          "kinder#organizationHausnummerSorgerecht": "1",
          "kinder#organizationPlzSorgerecht": "10969",
          "kinder#organizationOrtSorgerecht": "Musterstadt",
        },
      },
      {
        stepId: "/kinder/uebersicht",
      },
      {
        stepId: "/abgabe/weitere-informationen",
      },
    ],
    withKidsAndUnderAgeWithAdresseAndSorgerechtShared: [
      ...defaultStepsWithKidsUnderAge,
      {
        stepId: "/kinder/#/sorgerecht",
        userInput: {
          "kinder#optionSorgerecht": "shared",
        },
      },
      {
        stepId: "/kinder/#/sorgerecht-person",
        userInput: {
          "kinder#vornameSorgerecht": "Clara",
          "kinder#nachnameSorgerecht": "Mustermann",
          "kinder#geburtsnameSorgerecht": "",
        },
      },
      {
        stepId: "/kinder/#/sorgerecht-gleiche-adresse",
        userInput: {
          "kinder#hasSorgerechtSameAddress": "no",
        },
      },
      {
        stepId: "/kinder/#/sorgerecht-adresse",
        userInput: {
          "kinder#strasseSorgerecht": "Musterstraße",
          "kinder#hausnummerSorgerecht": "11",
          "kinder#plzSorgerecht": "10969",
          "kinder#ortSorgerecht": "Musterstadt",
        },
      },
      {
        stepId: "/kinder/#/erbe-ausschlagende",
        userInput: {
          "kinder#hasRenouncedInheritance": "yes",
        },
      },
      {
        stepId: "/kinder/uebersicht",
      },
      {
        stepId: "/abgabe/weitere-informationen",
      },
    ],
    withKidsAndUnderAgeWithAdresseAndSorgerechtAnotherPerson: [
      ...defaultStepsWithKidsUnderAge,
      {
        stepId: "/kinder/#/sorgerecht",
        userInput: {
          "kinder#optionSorgerecht": "anotherPerson",
        },
      },
      {
        stepId: "/kinder/#/sorgerecht-person",
        userInput: {
          "kinder#vornameSorgerecht": "Clara",
          "kinder#nachnameSorgerecht": "Mustermann",
          "kinder#geburtsnameSorgerecht": "",
        },
      },
      {
        stepId: "/kinder/#/sorgerecht-gleiche-adresse",
        userInput: {
          "kinder#hasSorgerechtSameAddress": "no",
        },
      },
      {
        stepId: "/kinder/#/sorgerecht-adresse",
        userInput: {
          "kinder#strasseSorgerecht": "Musterstraße",
          "kinder#hausnummerSorgerecht": "11",
          "kinder#plzSorgerecht": "10969",
          "kinder#ortSorgerecht": "Musterstadt",
        },
      },
      {
        stepId: "/kinder/uebersicht",
      },
      {
        stepId: "/abgabe/weitere-informationen",
      },
    ],
  };
