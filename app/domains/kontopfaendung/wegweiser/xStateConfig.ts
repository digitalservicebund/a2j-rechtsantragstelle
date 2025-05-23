import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { Config } from "~/services/flow/server/buildFlowController";
import { type KontopfaendungWegweiserUserData } from "./userData";

const sozialleistungenUmstaendeSelected = (
  context: KontopfaendungWegweiserUserData,
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
            target: "pfaendung-strafe",
            guard: ({ context }) =>
              context.schuldenBei === "staatsanwaltschaft" ||
              context.schuldenBei === "kasse",
          },
          {
            target: "pfaendung-unterhalt",
            guard: ({ context }) =>
              context.schuldenBei === "privat" ||
              context.schuldenBei === "jugendamt",
          },
          "sockelbetrag",
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
    "pfaendung-strafe": {
      on: {
        SUBMIT: "sockelbetrag",
        BACK: "glaeubiger",
      },
    },
    "pfaendung-unterhalt": {
      on: {
        SUBMIT: "sockelbetrag",
        BACK: "glaeubiger",
      },
    },
    "glaeubiger-unbekannt": {
      on: {
        SUBMIT: "sockelbetrag",
        BACK: "glaeubiger",
      },
    },
    sockelbetrag: {
      on: {
        SUBMIT: [
          {
            target: "ergebnis/geringe-einkuenfte",
            guard: ({ context }) => context.sockelbetrag === "nein",
          },
          "zwischenseite-unterhalt",
        ],
        BACK: [
          {
            target: "glaeubiger-unbekannt",
            guard: ({ context }) => context.schuldenBei === "weissNicht",
          },
          {
            target: "pfaendung-strafe",
            guard: ({ context }) =>
              context.schuldenBei === "staatsanwaltschaft" ||
              context.schuldenBei === "kasse",
          },
          {
            target: "pfaendung-unterhalt",
            guard: ({ context }) =>
              context.schuldenBei === "privat" ||
              context.schuldenBei === "jugendamt",
          },
          "glaeubiger",
        ],
      },
    },
    "ergebnis/geringe-einkuenfte": {
      on: { BACK: "sockelbetrag" },
    },
    "zwischenseite-unterhalt": {
      on: {
        SUBMIT: "kinder",
        BACK: "sockelbetrag",
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
        SUBMIT: "kinder-unterhalt",
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
          "zwischenseite-einkuenfte",
        ],
        BACK: [
          {
            target: "kinder-unterhalt",
            guard: ({ context }) => context.hasKinder === "yes",
          },
          "kinder",
        ],
      },
    },
    "partner-wohnen-zusammen": {
      on: {
        SUBMIT: "partner-unterhalt",
        BACK: "partner",
      },
    },
    "partner-unterhalt": {
      on: {
        SUBMIT: "zwischenseite-einkuenfte",
        BACK: [
          {
            target: "partner",
            guard: ({ context }) => context.verheiratet === "getrennt",
          },
          "partner-wohnen-zusammen",
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
              !!context.verheiratet && context.verheiratet !== "nein",
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
        SUBMIT: "nachzahlung-arbeitgeber",
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
            guard: ({ context }) => context.hasArbeit === "yes",
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
