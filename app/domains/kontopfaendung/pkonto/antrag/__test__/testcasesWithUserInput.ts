import type {
  FlowTestCases,
  FlowTestConfig,
} from "~/domains/__test__/TestCases";
import type { KontopfaendungPkontoAntragUserData } from "../userData";
import { kontopfaendungPkontoAntragXStateConfig } from "../xStateConfig";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";

const showAutoSummary = await isFeatureFlagEnabled("showAutoSummary");

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
    pkontoAntragKontoinhaberIsAntragsteller: [
      {
        stepId: "/start",
      },
      {
        stepId: "/grundvoraussetzungen/bestehendes-pkonto",
        userInput: { bestehendesPkonto: "no" },
      },
      {
        stepId: "/bankdaten/einleitung",
      },
      {
        stepId: "/bankdaten/kontodaten",
        userInput: {
          iban: "DE89370400440532013000",
          bankName: "Musterbank",
        },
      },
      {
        stepId: "/persoenliche-daten/kontoinhaber-name",
        userInput: {
          vollstaendigerName: "Max Mustermann",
        },
      },
      {
        stepId: "/persoenliche-daten/kontoinhaber-anschrift",
        userInput: {
          kontoinhaberStrasseHausnummer: "Musterstrasse 1",
          kontoinhaberPlz: 99084,
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
      ...(showAutoSummary
        ? [
            {
              stepId: "/abgabe/zusammenfassung",
            },
          ]
        : []),
      {
        stepId: "/abgabe/p-konto-vorhanden",
      },
    ],
  } satisfies FlowTestCases<KontopfaendungPkontoAntragUserData>,
} satisfies FlowTestConfig<KontopfaendungPkontoAntragUserData>;
