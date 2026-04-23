import type { Config } from "~/services/flow/server/types";
import type { KontopfaendungPkontoAntragUserData } from "./userData";
import { kontopfaendungPkontoAntragPages } from "./pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

const stepIds = xStateTargetsFromPagesConfig(kontopfaendungPkontoAntragPages);

export const kontopfaendungPkontoAntragXStateConfig = {
  id: "/kontopfaendung/pkonto/antrag",
  initial: "start",
  states: {
    start: {
      id: "start",
      meta: {
        shouldAppearAsMenuNavigation: true,
      },
      on: { SUBMIT: "#grundvoraussetzungen" },
    },
    grundvoraussetzungen: {
      id: "grundvoraussetzungen",
      initial: stepIds.grundvoraussetzungenDatenverarbeitung.relative,
      states: {
        [stepIds.grundvoraussetzungenDatenverarbeitung.relative]: {
          on: {
            BACK: "#start",
            SUBMIT: stepIds.bestehendesPkonto.relative,
          },
        },
        [stepIds.bestehendesPkonto.relative]: {
          on: {
            BACK: stepIds.grundvoraussetzungenDatenverarbeitung.relative,
            SUBMIT: [
              {
                guard: ({ context }) => context.bestehendesPkonto === "no",
                target: "#bankdaten",
              },
              stepIds.ende.relative,
            ],
          },
        },
        [stepIds.ende.relative]: {
          on: {
            BACK: stepIds.bestehendesPkonto.relative,
          },
        },
      },
    },
    bankdaten: {
      id: "bankdaten",
      initial: stepIds.bankdatenEinleitung.relative,
      states: {
        [stepIds.bankdatenEinleitung.relative]: {
          on: {
            BACK: stepIds.bestehendesPkonto.absolute,
            SUBMIT: stepIds.bankdatenKontodaten.relative,
          },
        },
        [stepIds.bankdatenKontodaten.relative]: {
          on: {
            BACK: stepIds.bankdatenEinleitung.relative,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  objectKeysNonEmpty(context, ["iban", "bankName"]),
                target: "#persoenliche-daten",
              },
            ],
          },
        },
      },
    },
    "persoenliche-daten": {
      id: "persoenliche-daten",
      initial: stepIds.kontoinhaberName.relative,
      states: {
        [stepIds.kontoinhaberName.relative]: {
          on: {
            BACK: stepIds.bankdatenKontodaten.absolute,
            SUBMIT: stepIds.kontoinhaberAnschrift.relative,
          },
        },
        [stepIds.kontoinhaberAnschrift.relative]: {
          on: {
            BACK: stepIds.kontoinhaberName.relative,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  objectKeysNonEmpty(context, [
                    "kontoinhaberStrasseHausnummer",
                    "kontoinhaberPlz",
                    "kontoinhaberOrt",
                  ]),
                target: stepIds.kontakt.relative,
              },
            ],
          },
        },
        [stepIds.kontakt.relative]: {
          id: stepIds.kontakt.relative,
          on: {
            BACK: stepIds.kontoinhaberAnschrift.relative,
            SUBMIT: "#abgabe",
          },
        },
      },
    },
    abgabe: {
      id: "abgabe",
      initial: stepIds.zusammenfassung.relative,
      meta: {
        shouldAppearAsMenuNavigation: true,
        excludedFromValidation: true,
      },
      states: {
        [stepIds.zusammenfassung.relative]: {
          on: {
            BACK: stepIds.kontakt.absolute,
            SUBMIT: stepIds.ergebnis.relative,
          },
        },
        [stepIds.ergebnis.relative]: {
          on: { BACK: stepIds.zusammenfassung.relative },
        },
      },
    },
  },
} satisfies Config<KontopfaendungPkontoAntragUserData>;
