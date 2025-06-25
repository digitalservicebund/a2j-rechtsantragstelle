import type { Config } from "~/services/flow/server/buildFlowController";
import { type KontopfaendungWegweiserUserData } from "./userData";

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
            target: "sozialleistung-nachzahlung",
            guard: ({ context }) =>
              context.hasSozialleistungen === "buergergeld" ||
              context.hasSozialleistungen === "grundsicherungSozialhilfe" ||
              context.hasSozialleistungen === "asylbewerberleistungen",
          },
          {
            target: "kindergeld",
            guard: ({ context }) => context.hasKinder === "yes",
          },
          "wohngeld",
        ],
        BACK: [
          {
            target: "einmalzahlung-arbeitgeber",
            guard: ({ context }) =>
              context.hasArbeit === "yes" &&
              Boolean(context.nachzahlungArbeitgeber),
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
    "sozialleistung-nachzahlung": {
      on: {
        SUBMIT: "sozialleistungen-einmalzahlung",
        BACK: "sozialleistungen",
      },
    },
    "sozialleistungen-einmalzahlung": {
      on: {
        SUBMIT: [
          {
            target: "kindergeld",
            guard: ({ context }) =>
              context.hasSozialleistungen === "buergergeld" ||
              context.hasSozialleistungen === "grundsicherungSozialhilfe" ||
              (context.hasSozialleistungen === "asylbewerberleistungen" &&
                context.hasKindergeld === "yes"),
          },
          "wohngeld",
        ],
        BACK: "sozialleistung-nachzahlung",
      },
    },
    pflegegeld: {
      on: {
        SUBMIT: "rente",
        BACK: [
          {
            target: "wohngeld-nachzahlung",
            guard: ({ context }) =>
              context.hasWohngeld === "yes" && context.wohngeld === "selbst",
          },
          {
            target: "wohngeld-empfaenger",
            guard: ({ context }) =>
              context.hasWohngeld === "yes" && context.wohngeld === "fremd",
          },
          "wohngeld",
        ],
      },
    },
    kindergeld: {
      on: {
        SUBMIT: [
          {
            target: "kindergeld-nachzahlung",
            guard: ({ context }) => context.hasKindergeld === "yes",
          },
          "wohngeld",
        ],
        BACK: [
          {
            target: "sozialleistungen-einmalzahlung",
            guard: ({ context }) =>
              context.hasSozialleistungen === "buergergeld" ||
              context.hasSozialleistungen === "grundsicherungSozialhilfe" ||
              context.hasSozialleistungen === "asylbewerberleistungen" ||
              context.hasSozialleistungen !== "nein",
          },
          "sozialleistungen",
        ],
      },
    },
    "kindergeld-nachzahlung": {
      on: {
        SUBMIT: "wohngeld",
        BACK: [
          {
            target: "kindergeld",
            guard: ({ context }) => context.hasKindergeld === "yes",
          },
          "sozialleistungen-einmalzahlung",
        ],
      },
    },
    wohngeld: {
      on: {
        SUBMIT: [
          {
            target: "wohngeld-empfaenger",
            guard: ({ context }) => context.hasWohngeld === "yes",
          },
          "pflegegeld",
        ],
        BACK: [
          {
            target: "kindergeld-nachzahlung",
            guard: ({ context }) =>
              context.hasKindergeldNachzahlung === "yes" &&
              context.hasKindergeld === "yes",
          },
          {
            target: "kindergeld",
            guard: ({ context }) =>
              context.hasKinder === "yes",
          },
          {
            target: "sozialleistungen-einmalzahlung",
            guard: ({ context }) =>
              context.hasKinder === "no" &&
              context.hasSozialleistungenEinmalzahlung === "yes",
          },
          "sozialleistungen",
        ],
      },
    },
    "wohngeld-empfaenger": {
      on: {
        SUBMIT: [
          {
            target: "wohngeld-nachzahlung",
            guard: ({ context }) => context.wohngeld === "selbst",
          },
          "pflegegeld",
        ],
        BACK: "wohngeld",
      },
    },
    "wohngeld-nachzahlung": {
      on: {
        SUBMIT: "pflegegeld",
        BACK: "wohngeld-empfaenger",
      },
    },
    rente: {
      on: {
        SUBMIT: "ergebnis/naechste-schritte",
        BACK: "pflegegeld",
      },
    },
    "ergebnis/naechste-schritte": {
      on: {
        BACK: [
          {
            target: "rente",
          },
        ],
      },
    },
  },
} satisfies Config<KontopfaendungWegweiserUserData>;
