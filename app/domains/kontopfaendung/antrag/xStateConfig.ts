import type { Config } from "~/services/flow/server/types";
import type { KontopfaendungPkontoAntragUserData } from "./userData";
import { kontopfaendungPkontoAntragPages } from "./pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

const stepIds = xStateTargetsFromPagesConfig(kontopfaendungPkontoAntragPages);

export const kontopfaendungPkontoAntragXStateConfig = {
  id: "/kontopfaendung/pkonto/antrag",
  initial: "start",
  meta: {
    pruneDataFromPageSchema: true,
  },
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
      initial: stepIds.bestehendesPkonto.relative,
      states: {
        [stepIds.bestehendesPkonto.relative]: {
          on: {
            BACK: "#start",
            SUBMIT: [
              {
                guard: ({ context }) => context.bestehendesPkonto === "no",
                target: stepIds.girokontoUmwandeln.relative,
              },
              {
                target: stepIds.ende.relative,
              },
            ],
          },
        },
        [stepIds.ende.relative]: {
          on: {
            BACK: stepIds.bestehendesPkonto.relative,
          },
        },
        [stepIds.girokontoUmwandeln.relative]: {
          on: {
            BACK: stepIds.bestehendesPkonto.relative,
            SUBMIT: [
              {
                guard: ({ context }) => context.girokontoUmwandeln === "yes",
                target: stepIds.negativerKontostand.relative,
              },
              {
                target: stepIds.neuesPkontoEroeffnen.relative,
              },
            ],
          },
        },
        [stepIds.neuesPkontoEroeffnen.relative]: {
          on: {
            BACK: stepIds.girokontoUmwandeln.relative,
          },
        },
        [stepIds.negativerKontostand.relative]: {
          on: {
            BACK: stepIds.girokontoUmwandeln.relative,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  context.negativerKontostand !== undefined,
                target: "#bankdaten",
              },
            ],
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
            BACK: stepIds.negativerKontostand.absolute,
            SUBMIT: stepIds.bankdatenKontodaten.relative,
          },
        },
        [stepIds.bankdatenKontodaten.relative]: {
          on: {
            BACK: stepIds.bankdatenEinleitung.relative,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  objectKeysNonEmpty(context, [
                    "kontoinhaberVorname",
                    "kontoinhaberNachname",
                    "iban",
                    "bankName",
                  ]),
                target: "#persoenliche-daten",
              },
            ],
          },
        },
      },
    },
    "persoenliche-daten": {
      id: "persoenliche-daten",
      initial: stepIds.kontoinhaberAnschrift.relative,
      states: {
        [stepIds.kontoinhaberAnschrift.relative]: {
          on: {
            BACK: stepIds.bankdatenKontodaten.absolute,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  objectKeysNonEmpty(context, [
                    "kontoinhaberStrasse",
                    "kontoinhaberHausnummer",
                    "kontoinhaberPlz",
                    "kontoinhaberOrt",
                  ]),
                target: stepIds.kontakt.relative,
              },
            ],
          },
        },
        [stepIds.kontakt.relative]: {
          on: {
            BACK: stepIds.kontoinhaberAnschrift.relative,
            SUBMIT: "#abgabe",
          },
        },
      },
    },
    abgabe: {
      id: "abgabe",
      meta: {
        shouldAppearAsMenuNavigation: true,
        excludedFromValidation: true,
      },
      on: {
        BACK: stepIds.kontakt.absolute,
      },
    },
  },
} satisfies Config<KontopfaendungPkontoAntragUserData>;
