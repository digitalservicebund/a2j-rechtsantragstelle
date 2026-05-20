import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { NachlassErbausschlagungAnfrageUserData } from "../../userData";

export const ausschlagendePersonTestCases: FlowTestCases<NachlassErbausschlagungAnfrageUserData> =
  {
    defaultAusschlagendePerson: [
      {
        stepId: "/ausschlagende-person/name",
        userInput: {
          ausschlagendePersonVorname: "Max",
          ausschlagendePersonNachname: "Mustermann",
        },
      },
      {
        stepId: "/ausschlagende-person/plz",
        userInput: {
          ausschlagendePersonPlz: "10969",
        },
      },
      {
        stepId: "/ausschlagende-person/adresse",
        userInput: {
          ausschlagendePersonStrasse: "Musterstraße",
          ausschlagendePersonHausnummer: "1",
          ausschlagendePersonOrt: "Musterstadt",
        },
      },
      {
        stepId: "/ausschlagende-person/kontakt",
        userInput: {
          ausschlagendePersonEmail: "",
          ausschlagendePersonTelefon: "0123456789",
        },
      },
      {
        stepId: "/ausschlagende-person/geburtsdatum",
        userInput: {
          ausschlagendePersonGeburtsdatum: {
            day: "01",
            month: "01",
            year: "1980",
          },
        },
      },
      {
        stepId: "/ausschlagende-person/beziehung-zum-erblasser",
        userInput: {
          ausschlagendePersonBeziehungZumErblasser: "mother-father",
        },
      },
      {
        stepId: "/kinder/haben-sie-kinder",
      },
    ],
  };
