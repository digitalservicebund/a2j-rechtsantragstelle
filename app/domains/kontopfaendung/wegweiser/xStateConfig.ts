import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { Config } from "~/services/flow/server/buildFlowController";
import { type KontopfaendungWegweiserContext } from "./context";

const sozialleistungenUmstaendeSelected = (
  context: KontopfaendungWegweiserContext,
) =>
  context.sozialleistungenUmstaende?.kindergeld === CheckboxValue.on ||
  context.sozialleistungenUmstaende?.wohngeld === CheckboxValue.on ||
  context.sozialleistungenUmstaende?.pflegegeld === CheckboxValue.on;

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
            guard: ({ context }) =>
              context.hasKontopfaendung === "ja" ||
              context.hasKontopfaendung === "weissNicht",
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
            target: "p-konto-probleme",
            guard: ({ context }) =>
              context.hasPKonto === "nichtEingerichtet" ||
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
            target: "ergebnis/geringe-einkuenfte",
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
          {
            target: "unterhalts-zahlungen",
            guard: ({ context }) =>
              context.schuldenBei === "privat" ||
              context.schuldenBei === "jugendamt",
          },
          "glaeubiger",
        ],
      },
    },
    "ergebnis/geringe-einkuenfte": {
      on: { BACK: "euro-schwelle" },
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
            target: "partner-support",
            guard: ({ context }) =>
              context.verheiratet === "getrennt" ||
              context.verheiratet === "geschieden" ||
              context.verheiratet === "verwitwet",
          },
          {
            target: "partner-wohnen-zusammen",
            guard: ({ context }) =>
              !!context.verheiratet && context.verheiratet !== "nein",
          },
          "zwischenseite-cash",
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
            guard: ({ context }) => context.verheiratet === "getrennt",
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
            target: "partner-support",
            guard: ({ context }) =>
              !!context.verheiratet && context.verheiratet !== "nein",
          },
          "partner",
        ],
      },
    },
    // TODO rename
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
          // TODO Rename
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
        BACK: [
          {
            target: "zahlungslimit",
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
            target: "zahlung-arbeitgeber",
            guard: ({ context }) => context.hasArbeit === "yes",
          },
          "ermittlung-betrags",
        ],
      },
    },
    "sozialleistungen-umstaende": {
      on: {
        SUBMIT: [
          {
            target: "pflegegeld",
            guard: ({ context }) =>
              context.sozialleistungenUmstaende?.pflegegeld ===
              CheckboxValue.on,
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
            target: "sozialleistung-nachzahlung-amount",
            guard: ({ context }) =>
              context.hasSozialleistungNachzahlung === "yes",
          },
          "sozialleistungen-einmalzahlung",
        ],
        BACK: [
          {
            target: "pflegegeld",
            guard: ({ context }) =>
              context.sozialleistungenUmstaende?.pflegegeld == CheckboxValue.on,
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
    "sozialleistung-nachzahlung-amount": {
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
            target: "sozialleistung-nachzahlung-amount",
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
} satisfies Config<KontopfaendungWegweiserContext>;
