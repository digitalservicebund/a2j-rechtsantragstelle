import type {
  FlowTestCases,
  FlowTestConfig,
} from "~/domains/__test__/TestCases";
import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { nachlassErbausschlagungAnfrageXStateConfig } from "~/domains/nachlass/erbausschlagung/anfrage/xStateConfig";

export const nachlassErbausschlagungAnfrageTestCases = {
  xstateConfig: nachlassErbausschlagungAnfrageXStateConfig,
  testcases: {
    auslaendischerLebensmittelpunkt: [
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
        stepId: "/verstorbene/testament",
      },
    ],
    pflegeheim: [
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
      {
        stepId: "/verstorbene/pflegeheim-plz",
        userInput: {
          pflegeheimPLZ: "10969",
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
        stepId: "/verstorbene/testament",
      },
    ],
    hospiz: [
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
        stepId: "/verstorbene/testament",
      },
    ],
    noPflegeheimOrHospiz: [
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
          verstorbenePLZ: "10969",
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
        stepId: "/verstorbene/testament",
      },
    ],
  } satisfies FlowTestCases<NachlassErbausschlagungAnfrageUserData>,
} satisfies FlowTestConfig<NachlassErbausschlagungAnfrageUserData>;
