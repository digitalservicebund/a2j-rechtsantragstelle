import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { Config } from "~/services/flow/server/buildFlowController";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  euroSchwelle,
  hasSozialleistungen,
  hasKontopfaendung,
  kontopfaendungWegweiserContext,
  hasPKonto,
  schuldenBei,
  verheiratet,
} from "./context";

export const kontopfaendungWegweiserXstateConfig = {
  id: "/schulden/kontopfaendung/wegweiser",
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
            guard: ({ context }) =>
              context.hasKontopfaendung === hasKontopfaendung.Values.nein,
          },
          {
            target: "p-konto",
          },
        ],
        BACK: "start",
      },
    },
    ergebnisseite: {
      on: {
        BACK: [
          {
            target: "euro-schwelle",
            guard: ({ context }) =>
              context.euroSchwelle === euroSchwelle.Values.nein,
          },
          {
            target: "kontopfaendung",
          },
        ],
      },
    },
    "p-konto": {
      on: {
        SUBMIT: [
          {
            target: "p-konto-probleme",
            guard: ({ context }) =>
              context.hasPKonto === hasPKonto.Values.bank ||
              context.hasPKonto === hasPKonto.Values.nichtAktiv,
          },
          {
            target: "glaeubiger",
          },
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
            guard: ({ context }) =>
              context.schuldenBei === schuldenBei.Values.weissNicht,
          },
          {
            target: "euro-schwelle",
          },
        ],
        BACK: "p-konto",
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
            guard: ({ context }) =>
              context.euroSchwelle === euroSchwelle.Values.nein,
          },
          {
            target: "zwischenseite-unterhalt",
          },
        ],
        BACK: [
          {
            target: "glaeubiger-unbekannt",
            guard: ({ context }) =>
              context.schuldenBei === schuldenBei.Values.weissNicht,
          },
          {
            target: "glaeubiger",
          },
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
            guard: ({ context }) =>
              context.hasKinder === YesNoAnswer.Values.yes,
          },
          {
            target: "partner",
          },
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
            guard: ({ context }) =>
              context.verheiratet === verheiratet.Values.nein ||
              context.verheiratet === verheiratet.Values.verwitwet,
          },
          {
            target: "partner-support",
          },
        ],
        BACK: [
          {
            target: "kinder-support",
            guard: ({ context }) =>
              context.hasKinder === YesNoAnswer.Values.yes,
          },
          {
            target: "kinder",
          },
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
              context.verheiratet !== verheiratet.Values.nein &&
              context.verheiratet !== verheiratet.Values.verwitwet,
          },
          {
            target: "partner-wohnen-zusammen",
          },
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
              context.verheiratet === verheiratet.Values.nein ||
              context.verheiratet === verheiratet.Values.verwitwet,
          },
          {
            target: "partner-support",
          },
        ],
      },
    },
    "ermittlung-betrags": {
      on: {
        SUBMIT: [
          {
            target: "arbeitsweise",
            guard: ({ context }) =>
              context.hasArbeit === YesNoAnswer.Values.yes,
          },
          {
            target: "sozialleistungen",
          },
        ],
        BACK: "zwischenseite-cash",
      },
    },
    arbeitsweise: {
      on: {
        SUBMIT: "nachzahlung-arbeitgeber",
        BACK: "start",
      },
    },
    "nachzahlung-arbeitgeber": {
      on: {
        SUBMIT: [
          {
            target: "zahlungslimit",
            guard: ({ context }) =>
              context.nachzahlungArbeitgeber === YesNoAnswer.Values.yes,
          },
          {
            target: "zahlung-arbeitgeber",
          },
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
        BACK: "nachzahlung-arbeitgeber",
      },
    },
    sozialleistungen: {
      on: {
        SUBMIT: [
          {
            target: "sozialleistungen-umstaende",
            guard: ({ context }) =>
              context.hasSozialleistungen === hasSozialleistungen.Values.nein,
          },
          {
            target: "sozialleistung-nachzahlung",
          },
        ],
        BACK: [
          {
            target: "start",
            guard: ({ context }) => context.hasArbeit === YesNoAnswer.Values.no,
          },
          {
            target: "zahlung-arbeitgeber",
          },
        ],
      },
    },
    "sozialleistungen-umstaende": {
      on: {
        SUBMIT: [
          {
            target: "sozialleistung-nachzahlung",
            guard: ({ context }) =>
              context.sozialleistungenUmstaende?.nein === CheckboxValue.off,
          },
          {
            target: "besondere-ausgaben",
          },
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
              context.hasSozialleistungNachzahlung === YesNoAnswer.Values.yes,
          },
          {
            target: "sozialleistungen-einmalzahlung",
          },
        ],
        BACK: [
          {
            target: "sozialleistungen-umstaende",
            guard: ({ context }) =>
              context.hasSozialleistungen === hasSozialleistungen.Values.nein,
          },
          {
            target: "sozialleistungen",
          },
        ],
      },
    },
    "sozialleistung-nachzahlung-amount": {
      on: {
        SUBMIT: [
          {
            target: "sozialleistungen-einmalzahlung",
            guard: ({ context }) =>
              context.socialAmountHigher500 === YesNoAnswer.Values.no ||
              context.socialAmountHigher500 === YesNoAnswer.Values.yes,
          },
        ],
        BACK: "sozialleistung-nachzahlung",
      },
    },
    "sozialleistungen-einmalzahlung": {
      on: {
        SUBMIT: [
          {
            target: "besondere-ausgaben",
            guard: ({ context }) =>
              context.hasSozialleistungenEinmalzahlung ===
                YesNoAnswer.Values.no ||
              context.hasSozialleistungenEinmalzahlung ===
                YesNoAnswer.Values.yes,
          },
        ],
        BACK: [
          {
            target: "sozialleistung-nachzahlung",
            guard: ({ context }) =>
              context.hasSozialleistungNachzahlung === YesNoAnswer.Values.no,
          },
          {
            target: "sozialleistung-nachzahlung-amount",
          },
        ],
      },
    },
    "besondere-ausgaben": {
      on: {
        SUBMIT: [
          {
            target: "",
          },
        ],
        BACK: [
          {
            target: "sozialleistungen-umstaende",
            guard: ({ context }) =>
              context.sozialleistungenUmstaende?.nein === CheckboxValue.on,
          },
          {
            target: "sozialleistungen-einmalzahlung",
          },
        ],
      },
    },
  },
} satisfies Config<kontopfaendungWegweiserContext>;
