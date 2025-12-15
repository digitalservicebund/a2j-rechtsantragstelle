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
                target: stepIds.alleinigKontofuehrend.relative,
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
        [stepIds.alleinigKontofuehrend.relative]: {
          on: {
            BACK: stepIds.girokontoUmwandeln.relative,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  context.alleinigKontofuehrend !== undefined,
                target: stepIds.negativerKontostand.relative,
              },
            ],
          },
        },
        [stepIds.negativerKontostand.relative]: {
          on: {
            BACK: stepIds.alleinigKontofuehrend.relative,
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
                    "kontoinhaber",
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
      initial: stepIds.persoenlicheDatenNameAnschrift.relative,
      states: {
        [stepIds.persoenlicheDatenNameAnschrift.relative]: {
          on: {
            BACK: stepIds.bankdatenKontodaten.absolute,
            SUBMIT: [
              {
                guard: ({ context }) =>
                  objectKeysNonEmpty(context, [
                    "vornameNachname",
                    "strasseHausnummer",
                    "plz",
                    "ort",
                  ]),
                target: stepIds.persoenlicheDatenKontakt.relative,
              },
            ],
          },
        },
        [stepIds.persoenlicheDatenKontakt.relative]: {
          on: {
            BACK: stepIds.persoenlicheDatenNameAnschrift.relative,
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
        BACK: stepIds.persoenlicheDatenKontakt.absolute,
      },
    },
  },
} satisfies Config<KontopfaendungPkontoAntragUserData>;
