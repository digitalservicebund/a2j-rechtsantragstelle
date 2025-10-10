import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { prozesskostenhilfeFormular } from "~/domains/prozesskostenhilfe/formular";
import { happyPathData } from "~/domains/prozesskostenhilfe/formular/__test__/prozesskostenhilfeFormularData";
import { testCasesPKHFormularGrundvoraussetzungen } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/__test__/testcases";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";

const showPKHZusammenfassung = await isFeatureFlagEnabled(
  "showPKHZusammenfassung",
);

export const prozesskostenhilfeFormularTestCases = {
  xstateConfig: prozesskostenhilfeFormular.config,
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
