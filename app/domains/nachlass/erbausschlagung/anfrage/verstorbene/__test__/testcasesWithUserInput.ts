import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { NachlassErbausschlagungAnfrageUserData } from "../../userData";

export const verstorbeneTestCases: FlowTestCases<NachlassErbausschlagungAnfrageUserData> =
  {
    defaultStartVerstorbene: [
      {
        stepId: "/verstorbene/name",
        userInput: {
          verstorbeneVorname: "Max",
          verstorbeneNachname: "Mustermann",
        },
      },
      {
        stepId: "/verstorbene/geburtsdatum",
        userInput: {
          verstorbeneGeburtsdatum: {
            day: "01",
            month: "01",
            year: "1900",
          },
        },
      },
      {
        stepId: "/verstorbene/sterbedatum",
        userInput: {
          verstorbeneSterbedatum: {
            day: "01",
            month: "01",
            year: "2020",
          },
        },
      },
      {
        stepId: "/verstorbene/lebensmittelpunkt",
      },
    ],
    verstorbeneAusland: [
      {
        stepId: "/verstorbene/lebensmittelpunkt",
        userInput: {
          verstorbeneLebensmittelpunkt: "ausland",
        },
      },
      {
        stepId: "/verstorbene/auslaendische-adresse",
        userInput: {
          verstorbeneAuslaendischeAdresseStrasse: "Musterstraße",
          verstorbeneAuslaendischeAdresseHausnummer: "1",
          verstorbeneAuslaendischeAdressePLZ: "10969",
          verstorbeneAuslaendischeAdresseOrt: "Musterstadt",
          verstorbeneAuslaendischeAdresseLand: "Deutschland",
        },
      },
      {
        stepId: "/ausschlagende-person/kenntnisdatum",
      },
    ],
    verstorbeneDeutschland: [
      {
        stepId: "/verstorbene/lebensmittelpunkt",
        userInput: {
          verstorbeneLebensmittelpunkt: "deutschland",
        },
      },
      {
        stepId: "/verstorbene/pflegeheim",
        userInput: {
          livedInNursingHome: "yes",
        },
      },
    ],
    verstorbenePflegeheimJa: [
      {
        stepId: "/verstorbene/pflegeheim",
        userInput: {
          livedInNursingHome: "yes",
        },
      },
      {
        stepId: "/verstorbene/pflegeheim-plz",
        userInput: {
          plzPflegeheim: "10969",
        },
      },
      {
        stepId: "/verstorbene/adresse",
        userInput: {
          verstorbeneAdresseStrasse: "Musterstraße",
          verstorbeneAdresseHausnummer: "1",
          verstorbeneAdresseOrt: "Musterstadt",
        },
      },
      {
        stepId: "/ausschlagende-person/kenntnisdatum",
      },
    ],
    verstorbenePflegeheimNoHospizYes: [
      {
        stepId: "/verstorbene/pflegeheim",
        userInput: {
          livedInNursingHome: "no",
        },
      },
      {
        stepId: "/verstorbene/hospiz",
        userInput: {
          livedInHospice: "yes",
        },
      },
      {
        stepId: "/verstorbene/plz-vor-hospiz",
        userInput: {
          plzBeforeHospiz: "10969",
        },
      },
      {
        stepId: "/verstorbene/adresse",
        userInput: {
          verstorbeneAdresseStrasse: "Musterstraße",
          verstorbeneAdresseHausnummer: "1",
          verstorbeneAdresseOrt: "Musterstadt",
        },
      },
      {
        stepId: "/ausschlagende-person/kenntnisdatum",
      },
    ],
    verstorbenePflegeheimNoHospizNo: [
      {
        stepId: "/verstorbene/pflegeheim",
        userInput: {
          livedInNursingHome: "no",
        },
      },
      {
        stepId: "/verstorbene/hospiz",
        userInput: {
          livedInHospice: "no",
        },
      },
      {
        stepId: "/verstorbene/plz",
        userInput: {
          plzVerstorbene: "10969",
        },
      },
      {
        stepId: "/verstorbene/adresse",
        userInput: {
          verstorbeneAdresseStrasse: "Musterstraße",
          verstorbeneAdresseHausnummer: "1",
          verstorbeneAdresseOrt: "Musterstadt",
        },
      },
      {
        stepId: "/ausschlagende-person/kenntnisdatum",
      },
    ],
  };
