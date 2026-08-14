import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { NachlassErbausschlagungAnfrageUserData } from "../../userData";

const happyPathData: Partial<NachlassErbausschlagungAnfrageUserData> = {
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

export const ausschlagendePersonTestCases: FlowTestCases<NachlassErbausschlagungAnfrageUserData> =
  {
    defaultAusschlagendePerson: [
      {
        stepId: "/ausschlagende-person/name",
        userInput: {
          ...happyPathData,
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
          pageData: {
            subflowDoneStates: {
              "/ausschlagende-person": true,
            },
          },
        },
      },
      {
        stepId: "/kinder/haben-sie-kinder",
      },
    ],
  };
