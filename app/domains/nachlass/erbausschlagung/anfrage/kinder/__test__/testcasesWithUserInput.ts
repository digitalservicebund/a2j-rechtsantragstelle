import type { ExpectedStep, FlowTestCases } from "~/domains/__test__/TestCases";
import type { NachlassErbausschlagungAnfrageUserData } from "../../userData";

const defaultStepsWithKidsUnderAge: Array<
  ExpectedStep<NachlassErbausschlagungAnfrageUserData>
> = [
  {
    stepId: "/kinder/haben-sie-kinder",
    userInput: {
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
    stepId: "/kinder/wie-viele-kinder-unter-18",
    userInput: {
      numberOfKidsUnder18: 1,
    },
  },
  {
    stepId: "/kinder/kinder-unter-18/uebersicht",
    addArrayItemEvent: "add-kinderUnder18",
  },
  {
    stepId: "/kinder/kinder-unter-18/kinder/0/name",
    userInput: {
      "kinderUnder18#vorname": "Clara",
      "kinderUnder18#nachname": "Mustermann",
      "kinderUnder18#geburtsdatum": {
        day: "01",
        month: "01",
        year: "2024",
      },
    },
  },
  {
    stepId: "/kinder/kinder-unter-18/kinder/0/wohnort",
    userInput: {
      "kinderUnder18#wohnortBeiAntragsteller": "yes",
    },
  },
];

export const kinderTestCases: FlowTestCases<NachlassErbausschlagungAnfrageUserData> =
  {
    withoutKids: [
      {
        stepId: "/kinder/haben-sie-kinder",
        userInput: {
          hasKid: "no",
        },
      },
      {
        stepId: "/abgabe/weitere-informationen",
      },
    ],
    withKidsWithoutUnderAge: [
      {
        stepId: "/kinder/haben-sie-kinder",
        userInput: {
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
        stepId: "/kinder/wie-viele-kinder-unter-18",
        userInput: {
          numberOfKidsUnder18: 0,
        },
      },
      {
        stepId: "/kinder/wie-viele-kinder-alter-18",
      },
    ],
    withKidsAndUnderAgeAndWarning: [
      {
        stepId: "/kinder/haben-sie-kinder",
        userInput: {
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
        stepId: "/kinder/wie-viele-kinder-unter-18",
        userInput: {
          numberOfKidsUnder18: 1,
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/uebersicht",
      },
      {
        stepId: "/kinder/kinder-unter-18/warnung",
      },
    ],
    withKidsAndUnderAgeWithoutAdresse: [
      {
        stepId: "/kinder/haben-sie-kinder",
        userInput: {
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
        stepId: "/kinder/wie-viele-kinder-unter-18",
        userInput: {
          numberOfKidsUnder18: 1,
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/uebersicht",
        addArrayItemEvent: "add-kinderUnder18",
      },
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/name",
        userInput: {
          "kinderUnder18#vorname": "Clara",
          "kinderUnder18#nachname": "Mustermann",
          "kinderUnder18#geburtsdatum": {
            day: "01",
            month: "01",
            year: "2024",
          },
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/wohnort",
        userInput: {
          "kinderUnder18#wohnortBeiAntragsteller": "no",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/adresse",
        userInput: {
          "kinderUnder18#strasse": "street",
          "kinderUnder18#hausnummer": "1",
          "kinderUnder18#plz": "10969",
          "kinderUnder18#ort": "Musterstadt",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/sorgerecht",
      },
    ],
    withKidsAndUnderAgeWithAdresseAndSorgerechtYes: [
      ...defaultStepsWithKidsUnderAge,
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/sorgerecht",
        userInput: {
          "kinderUnder18#optionSorgerecht": "yes",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/erbe-ausschlagende",
        userInput: {
          "kinderUnder18#hasRenouncedInheritance": "yes",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/uebersicht",
      },
      {
        stepId: "/kinder/wie-viele-kinder-alter-18",
      },
    ],
    withKidsAndUnderAgeWithAdresseAndSorgerechtOrganization: [
      ...defaultStepsWithKidsUnderAge,
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/sorgerecht",
        userInput: {
          "kinderUnder18#optionSorgerecht": "anotherOrganization",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/sorgerecht-organisation-name",
        userInput: {
          "kinderUnder18#organizationNameSorgerecht":
            "organizationNameSorgerecht",
        },
      },
      {
        stepId:
          "/kinder/kinder-unter-18/kinder/0/sorgerecht-organisation-adresse",
        userInput: {
          "kinderUnder18#organizationStrasseSorgerecht": "Musterstraße",
          "kinderUnder18#organizationHausnummerSorgerecht": "1",
          "kinderUnder18#organizationPlzSorgerecht": "10969",
          "kinderUnder18#organizationOrtSorgerecht": "Musterstadt",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/uebersicht",
      },
      {
        stepId: "/kinder/wie-viele-kinder-alter-18",
      },
    ],
    withKidsAndUnderAgeWithAdresseAndSorgerechtShared: [
      ...defaultStepsWithKidsUnderAge,
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/sorgerecht",
        userInput: {
          "kinderUnder18#optionSorgerecht": "shared",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/sorgerecht-person",
        userInput: {
          "kinderUnder18#vornameSorgerecht": "Clara",
          "kinderUnder18#nachnameSorgerecht": "Mustermann",
          "kinderUnder18#geburtsnameSorgerecht": "",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/sorgerecht-gleiche-address",
        userInput: {
          "kinderUnder18#hasSorgerechtSameAddress": "no",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/sorgerecht-adresse",
        userInput: {
          "kinderUnder18#strasseSorgerecht": "Musterstraße",
          "kinderUnder18#hausnummerSorgerecht": "11",
          "kinderUnder18#plzSorgerecht": "10969",
          "kinderUnder18#ortSorgerecht": "Musterstadt",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/erbe-ausschlagende",
        userInput: {
          "kinderUnder18#hasRenouncedInheritance": "yes",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/uebersicht",
      },
      {
        stepId: "/kinder/wie-viele-kinder-alter-18",
      },
    ],
    withKidsAndUnderAgeWithAdresseAndSorgerechtAnotherPerson: [
      ...defaultStepsWithKidsUnderAge,
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/sorgerecht",
        userInput: {
          "kinderUnder18#optionSorgerecht": "anotherPerson",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/sorgerecht-person",
        userInput: {
          "kinderUnder18#vornameSorgerecht": "Clara",
          "kinderUnder18#nachnameSorgerecht": "Mustermann",
          "kinderUnder18#geburtsnameSorgerecht": "",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/sorgerecht-gleiche-address",
        userInput: {
          "kinderUnder18#hasSorgerechtSameAddress": "no",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/kinder/0/sorgerecht-adresse",
        userInput: {
          "kinderUnder18#strasseSorgerecht": "Musterstraße",
          "kinderUnder18#hausnummerSorgerecht": "11",
          "kinderUnder18#plzSorgerecht": "10969",
          "kinderUnder18#ortSorgerecht": "Musterstadt",
        },
      },
      {
        stepId: "/kinder/kinder-unter-18/uebersicht",
      },
      {
        stepId: "/kinder/wie-viele-kinder-alter-18",
      },
    ],
  };
