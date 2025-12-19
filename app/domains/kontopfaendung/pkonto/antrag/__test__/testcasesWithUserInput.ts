import type {
  FlowTestCases,
  FlowTestConfig,
} from "~/domains/__test__/TestCases";
import type { KontopfaendungPkontoAntragUserData } from "../userData";
import { kontopfaendungPkontoAntragXStateConfig } from "../xStateConfig";

export const kontopfaendungPkontoAntragTestCases = {
  xstateConfig: kontopfaendungPkontoAntragXStateConfig,
  testcases: {
    bestehendesPkonto: [
      {
        stepId: "/start",
      },
      {
        stepId: "/grundvoraussetzungen/bestehendes-pkonto",
        userInput: { bestehendesPkonto: "yes" },
      },
      {
        stepId: "/grundvoraussetzungen/ende",
      },
    ],
    neuesPkontoEroeffnen: [
      {
        stepId: "/start",
      },
      {
        stepId: "/grundvoraussetzungen/bestehendes-pkonto",
        userInput: { bestehendesPkonto: "no" },
      },
      {
        stepId: "/grundvoraussetzungen/girokonto-umwandeln",
        userInput: { girokontoUmwandeln: "no" },
      },
      {
        stepId: "/grundvoraussetzungen/neues-pkonto-eroeffnen",
      },
    ],
    pkontoAntragKontoinhaberIsAntragsteller: [
      {
        stepId: "/start",
      },
      {
        stepId: "/grundvoraussetzungen/bestehendes-pkonto",
        userInput: { bestehendesPkonto: "no" },
      },
      {
        stepId: "/grundvoraussetzungen/girokonto-umwandeln",
        userInput: { girokontoUmwandeln: "yes" },
      },
      {
        stepId: "/grundvoraussetzungen/negativer-kontostand",
        userInput: { negativerKontostand: "yes" },
      },
      {
        stepId: "/bankdaten/einleitung",
      },
      {
        stepId: "/bankdaten/kontodaten",
        userInput: {
          kontoinhaberVorname: "Maximiliane",
          kontoinhaberNachname: "Mustermensch",
          iban: "DE89370400440532013000",
          bankName: "Musterbank",
        },
      },
      {
        stepId: "/persoenliche-daten/kontoinhaber-anschrift",
        userInput: {
          kontoinhaberStrasse: "Musterstrasse 1",
          kontoinhaberHausnummer: "1",
          kontoinhaberPlz: "99084",
          kontoinhaberOrt: "Musterstadt",
        },
      },
      {
        stepId: "/persoenliche-daten/kontakt",
        userInput: {
          telefonnummer: "0123456789",
          emailadresse: "email@adresse.de",
        },
      },
      {
        stepId: "/abgabe",
      },
    ],
  } satisfies FlowTestCases<KontopfaendungPkontoAntragUserData>,
} satisfies FlowTestConfig<KontopfaendungPkontoAntragUserData>;
