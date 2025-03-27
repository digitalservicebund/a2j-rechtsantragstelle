import type { Config } from "~/services/flow/server/buildFlowController";
import { KontopfaendungWegweiserContext } from "./context";

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
            target: "ergebnisseite",
            guard: ({ context }) => context.hasKontopfaendung === "nein",
          },
          "p-konto",
        ],
        BACK: "start",
      },
    },
    ergebnisseite: {
      on: {
        BACK: [
          {
            target: "euro-schwelle",
            guard: ({ context }) => context.euroSchwelle === "nein",
          },
          "kontopfaendung",
        ],
      },
    },
    "p-konto": {
      on: {
        SUBMIT: [
          {
            target: "p-konto-probleme",
            guard: ({ context }) =>
              context.hasPKonto === "bank" ||
              context.hasPKonto === "nichtAktiv",
          },
          "glaeubiger",
        ],
        BACK: "kontopfaendung",
      },
    },
    "p-konto-probleme": {
      on: {
        SUBMIT: "glaeubiger",
        BACK: "p-konto",
      },
    },
    glaeubiger: {
      on: {
        SUBMIT: [
          {
            target: "glaeubiger-unbekannt",
            guard: ({ context }) => context.schuldenBei === "weissNicht",
          },
          {
            target: "unerlaubten-handlung",
            guard: ({ context }) =>
              context.schuldenBei === "staatsanwaltschaft" ||
              context.schuldenBei === "kasse",
          },
          {
            target: "unterhalts-zahlungen",
            guard: ({ context }) =>
              context.schuldenBei === "privat" ||
              context.schuldenBei === "jugendamt",
          },
          "euro-schwelle",
        ],
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
    "unerlaubten-handlung": {
      on: {
        SUBMIT: "euro-schwelle",
        BACK: "glaeubiger",
      },
    },
    "unterhalts-zahlungen": {
      on: {
        SUBMIT: "euro-schwelle",
        BACK: "glaeubiger",
      },
    },
    "glaeubiger-unbekannt": {
      on: {
        SUBMIT: "euro-schwelle",
        BACK: "glaeubiger",
      },
    },
    "euro-schwelle": {
      on: {
        SUBMIT: [
          {
            target: "ergebnisseite",
            guard: ({ context }) => context.euroSchwelle === "nein",
          },
          "zwischenseite-unterhalt",
        ],
        BACK: [
          {
            target: "glaeubiger-unbekannt",
            guard: ({ context }) => context.schuldenBei === "weissNicht",
          },
          {
            target: "unerlaubten-handlung",
            guard: ({ context }) =>
              context.schuldenBei === "staatsanwaltschaft" ||
              context.schuldenBei === "kasse",
          },
          "unterhalts-zahlungen",
        ],
      },
    },
    "zwischenseite-unterhalt": {
      on: {
        SUBMIT: "kinder",
        BACK: "euro-schwelle",
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
        SUBMIT: "kinder-support",
        BACK: "kinder",
      },
    },
    "kinder-support": {
      on: {
        SUBMIT: "partner",
        BACK: "kinder-wohnen-zusammen",
      },
    },
    partner: {
      on: {
        SUBMIT: [
          {
            target: "zwischenseite-cash",
            guard: ({ context }) => context.verheiratet === "nein",
          },
          "partner-wohnen-zusammen",
        ],
        BACK: [
          {
            target: "kinder-support",
            guard: ({ context }) => context.hasKinder === "yes",
          },
          "kinder",
        ],
      },
    },
    "partner-wohnen-zusammen": {
      on: {
        SUBMIT: "partner-support",
        BACK: "partner",
      },
    },
    "partner-support": {
      on: {
        SUBMIT: "zwischenseite-cash",
        BACK: [
          {
            target: "partner",
            guard: ({ context }) =>
              context.verheiratet === "nein" ||
              context.verheiratet === "verwitwet",
          },
          "partner-wohnen-zusammen",
        ],
      },
    },
    "zwischenseite-cash": {
      on: {
        SUBMIT: "ermittlung-betrags",
        BACK: [
          {
            target: "partner",
            guard: ({ context }) =>
              context.verheiratet === "nein" ||
              context.verheiratet === "verwitwet",
          },
          "partner-support",
        ],
      },
    },
    "ermittlung-betrags": {
      on: {
        SUBMIT: [
          {
            target: "arbeitsweise",
            guard: ({ context }) => context.hasArbeit === "yes",
          },
          "sozialleistungen",
        ],
        BACK: "zwischenseite-cash",
      },
    },
    arbeitsweise: {
      on: {
        SUBMIT: "nachzahlung-arbeitgeber",
        BACK: "ermittlung-betrags",
      },
    },
    "nachzahlung-arbeitgeber": {
      on: {
        SUBMIT: [
          {
            target: "zahlungslimit",
            guard: ({ context }) => context.nachzahlungArbeitgeber === "yes",
          },
          "zahlung-arbeitgeber",
        ],
        BACK: "arbeitsweise",
      },
    },
    zahlungslimit: {
      on: {
        SUBMIT: "zahlung-arbeitgeber",
        BACK: "nachzahlung-arbeitgeber",
      },
    },
    "zahlung-arbeitgeber": {
      on: {
        SUBMIT: "sozialleistungen",
        BACK: "zahlungslimit",
      },
    },
    sozialleistungen: {
      on: {
        SUBMIT: [
          {
            target: "sozialleistungen-umstaende",
            guard: ({ context }) => context.hasSozialleistungen === "nein",
          },
          "sozialleistung-nachzahlung",
        ],
        BACK: "zahlung-arbeitgeber",
      },
    },
    "sozialleistungen-umstaende": {
      on: {
        SUBMIT: [
          {
            target: "sozialleistung-nachzahlung",
            guard: ({ context }) =>
              context.sozialleistungenUmstaende?.nein === "off",
          },
          "besondere-ausgaben",
        ],
        BACK: "sozialleistungen",
      },
    },
    "sozialleistung-nachzahlung": {
      on: {
        SUBMIT: [
          {
            target: "sozialleistung-nachzahlung-amount",
            guard: ({ context }) =>
              context.hasSozialleistungNachzahlung === "yes",
          },
          "sozialleistungen-einmalzahlung",
        ],
        BACK: [
          {
            target: "sozialleistungen-umstaende",
            guard: ({ context }) => context.hasSozialleistungen === "nein",
          },
          "sozialleistungen",
        ],
      },
    },
    "sozialleistung-nachzahlung-amount": {
      on: {
        SUBMIT: "sozialleistungen-einmalzahlung",
        BACK: "sozialleistung-nachzahlung",
      },
    },
    "sozialleistungen-einmalzahlung": {
      on: {
        SUBMIT: "besondere-ausgaben",
        BACK: [
          {
            target: "sozialleistung-nachzahlung",
            guard: ({ context }) =>
              context.hasSozialleistungNachzahlung === "no",
          },
          "sozialleistung-nachzahlung-amount",
        ],
      },
    },
    "besondere-ausgaben": {
      on: {
        SUBMIT: [
          {
            target: "ergebnisseite",
          },
        ],
        BACK: [
          {
            target: "sozialleistungen-umstaende",
            guard: ({ context }) =>
              context.sozialleistungenUmstaende?.nein === "on",
          },
          "sozialleistungen-einmalzahlung",
        ],
      },
    },
  },
} satisfies Config<KontopfaendungWegweiserContext>;
