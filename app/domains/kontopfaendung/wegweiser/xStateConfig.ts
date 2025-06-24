import type { Config } from "~/services/flow/server/buildFlowController";
import { type KontopfaendungWegweiserUserData } from "./userData";

const sozialleistungenUmstaendeSelected = (
  context: KontopfaendungWegweiserUserData,
) =>
  context.sozialleistungenUmstaende?.kindergeld === "on" ||
  context.sozialleistungenUmstaende?.wohngeld === "on" ||
  context.sozialleistungenUmstaende?.pflegegeld === "on";

export const kontopfaendungWegweiserXstateConfig = {
  id: "/kontopfaendung/wegweiser",
  initial: "start",
  states: {
    start: {
      on: {
        SUBMIT: "kontopfaendung",
      },
    },
    kontopfaendung: {
      on: {
        SUBMIT: [
          {
            target: "p-konto",
            guard: ({ context }) => context.hasKontopfaendung === "ja",
          },
          "ergebnis/keine-kontopfaendung",
        ],
        BACK: "start",
      },
    },
    "ergebnis/keine-kontopfaendung": {
      on: { BACK: "kontopfaendung" },
    },
    "p-konto": {
      on: {
        SUBMIT: [
          {
            target: "zwischenseite-unterhalt",
            guard: ({ context }) =>
              context.hasPKonto === "ja" || context.hasPKonto === "nein",
          },
          "p-konto-probleme",
        ],
        BACK: "kontopfaendung",
      },
    },
    "p-konto-probleme": {
      on: {
        SUBMIT: "zwischenseite-unterhalt",
        BACK: "p-konto",
      },
    },
    "zwischenseite-unterhalt": {
      on: {
        SUBMIT: "kinder",
        BACK: [
          {
            target: "p-konto",
            guard: ({ context }) =>
              context.hasPKonto === "ja" || context.hasPKonto === "nein",
          },
          "p-konto-probleme",
        ],
      },
    },
    kinder: {
      on: {
        SUBMIT: [
          {
            target: "kinder-wohnen-zusammen",
            guard: ({ context }) => context.hasKinder === "yes",
          },
          "partner",
        ],
        BACK: "zwischenseite-unterhalt",
      },
    },
    "kinder-wohnen-zusammen": {
      on: {
        SUBMIT: [
          {
            target: "kinder-unterhalt",
            guard: ({ context }) =>
              context.kinderWohnenZusammen === "nein" ||
              context.kinderWohnenZusammen === "teilweise",
          },
          "partner",
        ],
        BACK: "kinder",
      },
    },
    "kinder-unterhalt": {
      on: {
        SUBMIT: "partner",
        BACK: "kinder-wohnen-zusammen",
      },
    },
    partner: {
      on: {
        SUBMIT: [
          {
            target: "partner-unterhalt",
            guard: ({ context }) => context.verheiratet === "geschieden",
          },
          {
            target: "partner-wohnen-zusammen",
            guard: ({ context }) => context.verheiratet === "ja",
          },
          "zwischenseite-einkuenfte",
        ],
        BACK: [
          {
            target: "kinder-unterhalt",
            guard: ({ context }) =>
              context.hasKinder === "yes" &&
              (context.kinderWohnenZusammen === "nein" ||
                context.kinderWohnenZusammen === "teilweise"),
          },
          {
            target: "kinder-wohnen-zusammen",
            guard: ({ context }) => context.hasKinder === "yes",
          },
          "kinder",
        ],
      },
    },
    "partner-wohnen-zusammen": {
      on: {
        SUBMIT: [
          {
            target: "zwischenseite-einkuenfte",
            guard: ({ context }) => context.partnerWohnenZusammen === "yes",
          },
          {
            target: "partner-unterhalt",
            guard: ({ context }) => context.partnerWohnenZusammen === "no",
          },
        ],
        BACK: "partner",
      },
    },
    "partner-unterhalt": {
      on: {
        SUBMIT: "zwischenseite-einkuenfte",
        BACK: [
          {
            target: "partner-wohnen-zusammen",
            guard: ({ context }) =>
              context.verheiratet === "ja" &&
              context.partnerWohnenZusammen === "no",
          },
          "partner",
        ],
      },
    },
    "zwischenseite-einkuenfte": {
      on: {
        SUBMIT: "arbeit",
        BACK: [
          {
            target: "partner-unterhalt",
            guard: ({ context }) =>
              (context.verheiratet === "ja" &&
                context.partnerWohnenZusammen === "no") ||
              context.verheiratet === "geschieden",
          },
          {
            target: "partner-wohnen-zusammen",
            guard: ({ context }) =>
              context.verheiratet === "ja" &&
              context.partnerWohnenZusammen === "yes",
          },
          "partner",
        ],
      },
    },
    arbeit: {
      on: {
        SUBMIT: [
          {
            target: "arbeit-art",
            guard: ({ context }) => context.hasArbeit === "yes",
          },
          "sozialleistungen",
        ],
        BACK: "zwischenseite-einkuenfte",
      },
    },
    "arbeit-art": {
      on: {
        SUBMIT: [
          {
            target: "sozialleistungen",
            guard: ({ context }) =>
              (context.arbeitArt?.selbstaendig === "on" &&
                context.arbeitArt?.angestellt === "off") ||
              (context.arbeitArt?.selbstaendig === "off" &&
                context.arbeitArt?.angestellt === "off"),
          },
          "nachzahlung-arbeitgeber",
        ],
        BACK: "arbeit",
      },
    },
    "nachzahlung-arbeitgeber": {
      on: {
        SUBMIT: [
          {
            target: "hoehe-nachzahlung-arbeitgeber",
            guard: ({ context }) => context.nachzahlungArbeitgeber === "yes",
          },
          "einmalzahlung-arbeitgeber",
        ],
        BACK: "arbeit-art",
      },
    },
    "hoehe-nachzahlung-arbeitgeber": {
      on: {
        SUBMIT: "einmalzahlung-arbeitgeber",
        BACK: "nachzahlung-arbeitgeber",
      },
    },
    "einmalzahlung-arbeitgeber": {
      on: {
        SUBMIT: "sozialleistungen",
        BACK: [
          {
            target: "hoehe-nachzahlung-arbeitgeber",
            guard: ({ context }) => context.nachzahlungArbeitgeber === "yes",
          },
          "nachzahlung-arbeitgeber",
        ],
      },
    },
    sozialleistungen: {
      on: {
        SUBMIT: [
          {
            target: "sozialleistungen-umstaende",
          },
        ],
        BACK: [
          {
            target: "einmalzahlung-arbeitgeber",
            guard: ({ context }) =>
              context.hasArbeit === "yes" && !context.arbeitArt,
          },
          {
            target: "arbeit-art",
            guard: ({ context }) =>
              (context.arbeitArt?.selbstaendig === "on" &&
                context.arbeitArt?.angestellt === "off") ||
              (context.arbeitArt?.selbstaendig === "off" &&
                context.arbeitArt?.angestellt === "off"),
          },
          "arbeit",
        ],
      },
    },
    "sozialleistungen-umstaende": {
      on: {
        SUBMIT: [
          {
            target: "pflegegeld",
            guard: ({ context }) =>
              context.sozialleistungenUmstaende?.pflegegeld === "on",
          },
          {
            target: "sozialleistung-nachzahlung",
            guard: ({ context }) => sozialleistungenUmstaendeSelected(context),
          },
          "ergebnis/naechste-schritte",
        ],
        BACK: "sozialleistungen",
      },
    },
    pflegegeld: {
      on: {
        SUBMIT: "sozialleistung-nachzahlung",
        BACK: "sozialleistungen-umstaende",
      },
    },
    "sozialleistung-nachzahlung": {
      on: {
        SUBMIT: [
          {
            target: "hoehe-nachzahlung-sozialleistung",
            guard: ({ context }) =>
              context.hasSozialleistungNachzahlung === "yes",
          },
          "sozialleistungen-einmalzahlung",
        ],
        BACK: [
          {
            target: "pflegegeld",
            guard: ({ context }) =>
              context.sozialleistungenUmstaende?.pflegegeld == "on",
          },
          {
            target: "sozialleistungen",
            guard: ({ context }) =>
              !!context.hasSozialleistungen &&
              context.hasSozialleistungen !== "nein",
          },
          "sozialleistungen-umstaende",
        ],
      },
    },
    "hoehe-nachzahlung-sozialleistung": {
      on: {
        SUBMIT: "sozialleistungen-einmalzahlung",
        BACK: "sozialleistung-nachzahlung",
      },
    },
    "sozialleistungen-einmalzahlung": {
      on: {
        SUBMIT: "ergebnis/naechste-schritte",
        BACK: [
          {
            target: "hoehe-nachzahlung-sozialleistung",
            guard: ({ context }) =>
              context.hasSozialleistungNachzahlung === "yes",
          },
          "sozialleistung-nachzahlung",
        ],
      },
    },
    "ergebnis/naechste-schritte": {
      on: {
        BACK: [
          {
            target: "sozialleistungen-einmalzahlung",
            guard: ({ context }) => sozialleistungenUmstaendeSelected(context),
          },
          {
            target: "sozialleistungen-umstaende",
          },
        ],
      },
    },
  },
} satisfies Config<KontopfaendungWegweiserUserData>;
