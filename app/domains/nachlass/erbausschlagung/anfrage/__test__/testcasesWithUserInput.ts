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
        stepId: "/verstorbene/auslaendischeAdresse",
        userInput: {
          verstorbeneAuslaendischeAdresseStrasse: "Musterstraße",
          verstorbeneAuslaendischeAdresseHausnummer: "1",
          verstorbeneAuslaendischeAdressePLZ: "12345",
          verstorbeneAuslaendischeAdresseOrt: "Musterstadt",
          verstorbeneAuslaendischeAdresseLand: "Deutschland",
        },
      },
    ],
  } satisfies FlowTestCases<NachlassErbausschlagungAnfrageUserData>,
} satisfies FlowTestConfig<NachlassErbausschlagungAnfrageUserData>;
