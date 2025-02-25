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
  initial: "abfrage-basis-infos",
  states: {
    "abfrage-basis-infos": {
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
                guard: ({ context }) =>
                  context.hasKontopfaendung !== hasKontopfaendung.Values.nein,
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
                guard: ({ context }) =>
                  context.hasKontopfaendung === hasKontopfaendung.Values.nein &&
                  !context.euroSchwelle,
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
                guard: ({ context }) =>
                  context.hasPKonto === hasPKonto.Values.nein ||
                  context.hasPKonto === hasPKonto.Values.ja,
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
                guard: ({ context }) =>
                  context.schuldenBei !== schuldenBei.Values.weissNicht,
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
                target:
                  "#/schulden/kontopfaendung/wegweiser.zwischenseite-unterhalt",
                guard: ({ context }) =>
                  context.euroSchwelle !== euroSchwelle.Values.nein,
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
                guard: ({ context }) =>
                  context.schuldenBei !== schuldenBei.Values.weissNicht,
              },
            ],
          },
        },
      },
    },
    "zwischenseite-unterhalt": {
      initial: "start",
      states: {
        start: {
          on: {
            SUBMIT: "#/schulden/kontopfaendung/wegweiser.unterhalt",
            BACK: "#/schulden/kontopfaendung/wegweiser.abfrage-basis-infos.euro-schwelle",
          },
        },
      },
    },
    unterhalt: {
      initial: "kinder",
      states: {
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
                guard: ({ context }) =>
                  context.hasKinder === YesNoAnswer.Values.no,
              },
            ],
            BACK: "#/schulden/kontopfaendung/wegweiser.zwischenseite-unterhalt.start",
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
                target:
                  "#/schulden/kontopfaendung/wegweiser.zwischenseite-cash",
                guard: ({ context }) =>
                  context.verheiratet === verheiratet.Values.nein ||
                  context.verheiratet === verheiratet.Values.verwitwet,
              },
              {
                target: "partner-support",
                guard: ({ context }) =>
                  context.verheiratet !== verheiratet.Values.nein &&
                  context.verheiratet !== verheiratet.Values.verwitwet,
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
                guard: ({ context }) =>
                  context.hasKinder === YesNoAnswer.Values.no,
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
            SUBMIT:
              "#/schulden/kontopfaendung/wegweiser.zwischenseite-cash.start",
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
      },
    },
    "zwischenseite-cash": {
      initial: "start",
      states: {
        start: {
          on: {
            SUBMIT: "#/schulden/kontopfaendung/wegweiser.ermittlung-betrags",
            BACK: [
              {
                target: "#/schulden/kontopfaendung/wegweiser.unterhalt.partner",
                guard: ({ context }) =>
                  context.verheiratet === verheiratet.Values.nein ||
                  context.verheiratet === verheiratet.Values.verwitwet,
              },
              {
                target:
                  "#/schulden/kontopfaendung/wegweiser.unterhalt.partner-support",
                guard: ({ context }) =>
                  context.partnerWohnenZusammen === YesNoAnswer.Values.yes ||
                  context.verheiratet === verheiratet.Values.verwitwet,
              },
            ],
          },
        },
      },
    },
    "ermittlung-betrags": {
      initial: "start",
      states: {
        start: {
          on: {
            SUBMIT: [
              {
                target: "arbeitsweise",
                guard: ({ context }) =>
                  context.hasArbeit === YesNoAnswer.Values.yes,
              },
              {
                target: "sozialleistungen",
                guard: ({ context }) =>
                  context.hasArbeit === YesNoAnswer.Values.no,
              },
            ],
            BACK: "#/schulden/kontopfaendung/wegweiser.zwischenseite-cash",
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
                guard: ({ context }) =>
                  context.nachzahlungArbeitgeber === YesNoAnswer.Values.no,
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
                  context.hasSozialleistungen ===
                  hasSozialleistungen.Values.nein,
              },
              {
                target: "sozialleistung-nachzahlung",
                guard: ({ context }) =>
                  context.hasSozialleistungen !==
                  hasSozialleistungen.Values.nein,
              },
            ],
            BACK: [
              {
                target: "start",
                guard: ({ context }) =>
                  context.hasArbeit === YesNoAnswer.Values.no,
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
                guard: ({ context }) =>
                  context.sozialleistungenUmstaende?.nein ===
                    CheckboxValue.on &&
                  context.sozialleistungenUmstaende?.kindergeld ===
                    CheckboxValue.off &&
                  context.sozialleistungenUmstaende?.pflegegeld ===
                    CheckboxValue.off &&
                  context.sozialleistungenUmstaende?.wohngeld ===
                    CheckboxValue.off,
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
                  context.hasSozialleistungNachzahlung ===
                  YesNoAnswer.Values.yes,
              },
              {
                target: "sozialleistungen-einmalzahlung",
                guard: ({ context }) =>
                  context.hasSozialleistungNachzahlung ===
                  YesNoAnswer.Values.no,
              },
            ],
            BACK: [
              {
                target: "sozialleistungen-umstaende",
                guard: ({ context }) =>
                  context.hasSozialleistungen ===
                  hasSozialleistungen.Values.nein,
              },
              {
                target: "sozialleistungen",
                guard: ({ context }) =>
                  context.hasSozialleistungen !==
                  hasSozialleistungen.Values.nein,
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
                  context.hasSozialleistungNachzahlung ===
                  YesNoAnswer.Values.no,
              },
              {
                target: "sozialleistung-nachzahlung-amount",
                guard: ({ context }) =>
                  context.hasSozialleistungNachzahlung ===
                  YesNoAnswer.Values.yes,
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
                guard: ({ context }) =>
                  context.hasSozialleistungNachzahlung ===
                    YesNoAnswer.Values.no ||
                  context.hasSozialleistungNachzahlung ===
                    YesNoAnswer.Values.yes,
              },
            ],
          },
        },
      },
    },
  },
} satisfies Config<kontopfaendungWegweiserContext>;
