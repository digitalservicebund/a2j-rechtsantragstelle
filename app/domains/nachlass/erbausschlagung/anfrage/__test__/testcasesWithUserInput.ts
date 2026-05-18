import type {
  FlowTestCases,
  FlowTestConfig,
} from "~/domains/__test__/TestCases";
import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { nachlassErbausschlagungAnfrageXStateConfig } from "~/domains/nachlass/erbausschlagung/anfrage/xStateConfig";
import { today } from "~/util/date";

const testamentTestCases: FlowTestCases<NachlassErbausschlagungAnfrageUserData> =
  {
    noTestament: [
      {
        stepId: "/verstorbene/testament",
        userInput: {
          testament: "none",
        },
      },
      {
        stepId: "/verstorbene/kenntnisdatum",
        userInput: {
          awarenessDate: {
            day: "01",
            month: (today().getMonth() - 1).toString(),
            year: today().getFullYear().toString(),
          },
        },
      },
      {
        stepId: "/ausschlagende-person/name",
      },
    ],
    unknownTestament: [
      {
        stepId: "/verstorbene/testament",
        userInput: {
          testament: "unknown",
        },
      },
      {
        stepId: "/verstorbene/kenntnisdatum",
        userInput: {
          awarenessDate: {
            day: "01",
            month: (today().getMonth() - 1).toString(),
            year: today().getFullYear().toString(),
          },
        },
      },
      {
        stepId: "/ausschlagende-person/name",
      },
    ],
    handwrittenTestamentNotNamed: [
      {
        stepId: "/verstorbene/testament",
        userInput: {
          testament: "handwritten",
        },
      },
      {
        stepId: "/verstorbene/im-testament-genannt",
        userInput: {
          namedInTestament: "no",
        },
      },
      {
        stepId: "/verstorbene/ausschlagung-nicht-notwendig",
      },
    ],
    handwrittenTestamentNamedNoLetterReceived: [
      {
        stepId: "/verstorbene/testament",
        userInput: {
          testament: "handwritten",
        },
      },
      {
        stepId: "/verstorbene/im-testament-genannt",
        userInput: {
          namedInTestament: "yes",
        },
      },
      {
        stepId: "/verstorbene/brief-vom-nachlassgericht",
        userInput: {
          letterReceivedFromNachlassgericht: "no",
        },
      },
      {
        stepId: "/verstorbene/kenntnisdatum",
        userInput: {
          awarenessDate: {
            day: "01",
            month: (today().getMonth() - 1).toString(),
            year: today().getFullYear().toString(),
          },
        },
      },
      {
        stepId: "/ausschlagende-person/name",
      },
    ],
    handwrittenTestamentNamedLetterReceived: [
      {
        stepId: "/verstorbene/testament",
        userInput: {
          testament: "handwritten",
        },
      },
      {
        stepId: "/verstorbene/im-testament-genannt",
        userInput: {
          namedInTestament: "yes",
        },
      },
      {
        stepId: "/verstorbene/brief-vom-nachlassgericht",
        userInput: {
          letterReceivedFromNachlassgericht: "yes",
        },
      },
      {
        stepId: "/verstorbene/brief-vom-gericht",
        userInput: {
          dateOfReceipt: {
            day: "01",
            month: (today().getMonth() - 1).toString(),
            year: today().getFullYear().toString(),
          },
        },
      },
      {
        stepId: "/ausschlagende-person/name",
      },
    ],
    notarizedTestamentNotNamed: [
      {
        stepId: "/verstorbene/testament",
        userInput: {
          testament: "notarized",
        },
      },
      {
        stepId: "/verstorbene/im-testament-genannt",
        userInput: {
          namedInTestament: "no",
        },
      },
      {
        stepId: "/verstorbene/ausschlagung-nicht-notwendig",
      },
    ],
    notarizedTestamentNamed: [
      {
        stepId: "/verstorbene/testament",
        userInput: {
          testament: "notarized",
        },
      },
      {
        stepId: "/verstorbene/im-testament-genannt",
        userInput: {
          namedInTestament: "yes",
        },
      },
      {
        stepId: "/verstorbene/brief-vom-gericht",
        userInput: {
          dateOfReceipt: {
            day: "01",
            month: (today().getMonth() - 1).toString(),
            year: today().getFullYear().toString(),
          },
        },
      },
      {
        stepId: "/ausschlagende-person/name",
      },
    ],
    erbvertragNotNamed: [
      {
        stepId: "/verstorbene/testament",
        userInput: {
          testament: "erbvertrag",
        },
      },
      {
        stepId: "/verstorbene/im-testament-genannt",
        userInput: {
          namedInTestament: "no",
        },
      },
      {
        stepId: "/verstorbene/ausschlagung-nicht-notwendig",
      },
    ],
    erbvertragNamed: [
      {
        stepId: "/verstorbene/testament",
        userInput: {
          testament: "erbvertrag",
        },
      },
      {
        stepId: "/verstorbene/im-testament-genannt",
        userInput: {
          namedInTestament: "yes",
        },
      },
      {
        stepId: "/verstorbene/brief-vom-gericht",
        userInput: {
          dateOfReceipt: {
            day: "01",
            month: (today().getMonth() - 1).toString(),
            year: today().getFullYear().toString(),
          },
        },
      },
      {
        stepId: "/ausschlagende-person/name",
      },
    ],
  };

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
    ...testamentTestCases,
  } satisfies FlowTestCases<NachlassErbausschlagungAnfrageUserData>,
} satisfies FlowTestConfig<NachlassErbausschlagungAnfrageUserData>;
