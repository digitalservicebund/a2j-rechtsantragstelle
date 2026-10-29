import type { FlowTestConfig } from "~/domains/__test__/TestCases";
import { grundbuchauszugAntragFlowConfig } from "../flowConfig";
import { type GrundbuchauszugAntragUserData } from "../userData";

export const grundbuchauszugAntragTestCases = {
  config: grundbuchauszugAntragFlowConfig,
  testcases: {
    ownerSelection: [
      {
        stepId: "/start",
      },
      {
        stepId: "/antragsgrund/berechtigtes-interesse",
        userInput: { legitimateInterest: "owner" },
      },
      {
        stepId: "/antragsgrund/nachweis-hochladen",
      },
      {
        stepId: "/grundstuecksdaten",
      },
    ],
    landRegisterOnMyNameSelection: [
      {
        stepId: "/start",
      },
      {
        stepId: "/antragsgrund/berechtigtes-interesse",
        userInput: { legitimateInterest: "landRegisterOnMyName" },
      },
      {
        stepId: "/antragsgrund/angaben-zum-recht",
        userInput: { registerLaw: "something" },
      },

      {
        stepId: "/antragsgrund/nachweis-hochladen",
      },
      {
        stepId: "/grundstuecksdaten",
      },
    ],
    otherReasonsSelection: [
      {
        stepId: "/start",
      },
      {
        stepId: "/antragsgrund/berechtigtes-interesse",
        userInput: { legitimateInterest: "otherReasons" },
      },
      {
        stepId: "/antragsgrund/nachweis-hochladen",
      },
      {
        stepId: "/grundstuecksdaten",
      },
    ],
    defaultFlowTest: [
      {
        stepId: "/grundstuecksdaten",
        userInput: {
          legitimateInterest: "otherReasons",
          landRegistryLocale: "landRegistryLocale",
          landRegisterParcel: "landRegisterParcel",
          landRegisterPageNumber: 1,
        },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/artAuszug",
        userInput: {
          typeOfCopy: "basic",
        },
      },
      {
        stepId: "/anzahlAusdrucke",
        userInput: {
          numberOfCopies: 1,
        },
      },
      {
        stepId: "/persoenliche-daten/name",
        userInput: {
          vorname: "vorname",
          nachname: "nachname",
        },
      },
      {
        stepId: "/persoenliche-daten/geburtsdatum",
        userInput: {
          geburtsdatum: { day: "01", month: "01", year: "2025" },
        },
      },
      {
        stepId: "/persoenliche-daten/anschrift",
        userInput: {
          strasse: "strasse",
          hausnummer: "1",
          plz: "13055",
          ort: "ort",
        },
      },
      {
        stepId: "/persoenliche-daten/kontakt",
        userInput: {
          email: "kanzlei@example.com",
        },
      },
      {
        stepId: "/abgabe/zusammenfassung",
      },
    ],
  },
} satisfies FlowTestConfig<
  GrundbuchauszugAntragUserData,
  typeof grundbuchauszugAntragFlowConfig.pages
>;
