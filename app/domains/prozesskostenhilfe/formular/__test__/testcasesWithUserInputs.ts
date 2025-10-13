import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { prozesskostenhilfeFormular } from "~/domains/prozesskostenhilfe/formular";
import { happyPathData } from "~/domains/prozesskostenhilfe/formular/__test__/prozesskostenhilfeFormularData";
import { testCasesPKHFormularAntragstellendePersonTransitions } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/__test__/testcases";
import {
  testCasesPKHFormularAntragstellendePersonVereinfachteErklaerung,
  testCasesPKHFormularAntragstellendePersonVereinfachteErklaerungTransitions,
} from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/__test__/testcases";
import { testCasesPKHFormularFinanzielleAngabenEinkuenfte } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/__test__/testcasesEinkuenfte";
import { testCasesPKHFormularFinanzielleAngabenPartner } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/__test__/testcasesPartner";
import { testCasesPKHFormularGrundvoraussetzungen } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/__test__/testcases";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";

const showPKHZusammenfassung = await isFeatureFlagEnabled(
  "showPKHZusammenfassung",
);

export const prozesskostenhilfeFormularTestCases = {
  xstateConfig: prozesskostenhilfeFormular.config,
  guards: prozesskostenhilfeFormular.guards,
  testcases: {
    shortHappyPath: [
      {
        stepId: "/gesetzliche-vertretung/frage",
        userInput: {
          hasGesetzlicheVertretung: "yes",
        },
      },
      {
        stepId: "/gesetzliche-vertretung/daten",
        userInput: {
          gesetzlicheVertretungDaten: {
            vorname: "Max",
            nachname: "Mustermann",
            strasseHausnummer: "Musterstraße 1",
            plz: "10969",
            ort: "Musterstadt",
            telefonnummer: "0123456789",
          },
        },
      },
      {
        stepId: "/persoenliche-daten/start",
      },
      {
        stepId: "/persoenliche-daten/name",
        userInput: {
          vorname: "Marie",
          nachname: "Mustermann",
        },
      },
      {
        stepId: "/persoenliche-daten/geburtsdatum",
        userInput: {
          geburtsdatum: {
            day: "10",
            month: "12",
            year: "1990",
          },
        },
      },
      {
        stepId: "/persoenliche-daten/plz",
        userInput: {
          plz: "10969",
        },
      },
      {
        stepId: "/persoenliche-daten/adresse",
        userInput: {
          street: "Musterstraße",
          houseNumber: "1c",
          ort: "Berlin",
        },
      },
      {
        stepId: "/persoenliche-daten/telefonnummer",
        userInput: {
          telefonnummer: "",
        },
      },
      {
        stepId: "/persoenliche-daten/beruf",
        userInput: {
          beruf: "Softwareentwickler:in",
        },
      },
      {
        stepId: "/weitere-angaben",
        userInput: {
          ...happyPathData,
          weitereAngaben: "",
        },
      },
      {
        stepId: showPKHZusammenfassung
          ? "/abgabe/zusammenfassung"
          : "/abgabe/ende",
      },
    ],
    ...testCasesPKHFormularGrundvoraussetzungen,
    ...testCasesPKHFormularAntragstellendePersonTransitions,
    ...testCasesPKHFormularAntragstellendePersonVereinfachteErklaerung,
    ...testCasesPKHFormularAntragstellendePersonVereinfachteErklaerungTransitions,
    ...testCasesPKHFormularFinanzielleAngabenEinkuenfte,
    ...testCasesPKHFormularFinanzielleAngabenPartner,
    weitereAngaben: [
      {
        stepId: "/persoenliche-daten/beruf",
        userInput: {
          beruf: "Softwareentwickler:in",
        },
      },
      {
        stepId: "/weitere-angaben",
        userInput: {
          weitereAngaben: "",
        },
      },
      {
        stepId: "/abgabe/ueberpruefung",
        userInput: {
          weitereAngaben: "",
        },
      },
    ],
  },
} satisfies FlowTestCases;
