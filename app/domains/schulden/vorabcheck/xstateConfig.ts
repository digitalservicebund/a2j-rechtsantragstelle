import type { Config } from "~/services/flow/server/buildFlowController";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  euroSchwelleType,
  kontopfaendungType,
  kontopfaendungWegweiserContext,
  paymentArbeitgeberType,
  pKontoType,
  schuldenBeiType,
  verheiratetType,
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
                  context.hasKontopfaendung === kontopfaendungType.Values.nein,
              },
              {
                target: "p-konto",
                guard: ({ context }) =>
                  context.hasKontopfaendung !== kontopfaendungType.Values.nein,
              },
            ],
            BACK: "start",
          },
        },
        ergebnisseite: {
          on: { BACK: "start" },
        },
        "p-konto": {
          on: {
            SUBMIT: [
              {
                target: "p-konto-probleme",
                guard: ({ context }) =>
                  context.hasPKonto === pKontoType.Values.bank ||
                  context.hasPKonto === pKontoType.Values.nichtAktiv,
              },
              {
                target: "glaeubiger",
                guard: ({ context }) =>
                  context.hasPKonto === pKontoType.Values.nein ||
                  context.hasPKonto === pKontoType.Values.ja,
              },
            ],
            BACK: "kontopfaendung",
          },
        },
        "p-konto-probleme": {
          on: {
            SUBMIT: [
              {
                target: "glaeubiger",
              },
            ],
            BACK: "p-konto",
          },
        },
        glaeubiger: {
          on: {
            SUBMIT: [
              {
                target: "glaeubiger-unbekannt",
                guard: ({ context }) =>
                  context.schuldenBei === schuldenBeiType.Values.weissNicht,
              },
              {
                target: "euro-schwelle",
                guard: ({ context }) =>
                  context.schuldenBei !== schuldenBeiType.Values.weissNicht,
              },
            ],
            BACK: "p-konto",
          },
        },
        "glaeubiger-unbekannt": {
          on: {
            SUBMIT: [
              {
                target: "euro-schwelle",
              },
            ],
            BACK: "glaeubiger",
          },
        },
        "euro-schwelle": {
          on: {
            SUBMIT: [
              {
                target: "ergebnisseite",
                guard: ({ context }) =>
                  context.euroSchwelle === euroSchwelleType.Values.nein ||
                  context.euroSchwelle === euroSchwelleType.Values.ja,
              },
              {
                target: "#/schulden/kontopfaendung/wegweiser.zwischenseite",
                guard: ({ context }) =>
                  context.euroSchwelle === euroSchwelleType.Values.weissNicht ||
                  context.euroSchwelle ===
                    euroSchwelleType.Values.unterschiedlich,
              },
            ],
            BACK: "glaeubiger",
          },
        },
      },
    },
    zwischenseite: {
      initial: "unterhalt",
      states: {
        unterhalt: {
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
            BACK: "#/schulden/kontopfaendung/wegweiser.zwischenseite.unterhalt",
          },
        },
        "kinder-wohnen-zusammen": {
          on: {
            SUBMIT: [
              {
                target: "kinder-support",
              },
            ],
            BACK: "kinder",
          },
        },
        "kinder-support": {
          on: {
            SUBMIT: [
              {
                target: "partner",
              },
            ],
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
                  context.verheiratet === verheiratetType.Values.nein ||
                  context.verheiratet === verheiratetType.Values.verwitwet,
              },
              {
                target: "partner-support",
                guard: ({ context }) =>
                  context.verheiratet !== verheiratetType.Values.nein &&
                  context.verheiratet !== verheiratetType.Values.verwitwet,
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
            SUBMIT: "#/schulden/kontopfaendung/wegweiser.zwischenseite-cash",
            BACK: "partner-wohnen-zusammen",
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
            BACK: "#/schulden/kontopfaendung/wegweiser.unterhalt.partner",
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
                target: "", //todo
                guard: ({ context }) =>
                  context.hasArbeit === YesNoAnswer.Values.no,
              },
            ],
            BACK: "#/schulden/kontopfaendung/wegweiser.unterhalt.partner",
          },
        },
        arbeitsweise: {
          on: {
            SUBMIT: [
              {
                target: "nachzahlung-arbeitgeber",
              },
            ],
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
                target: "",
                guard: ({ context }) =>
                  context.nachzahlungArbeitgeber === YesNoAnswer.Values.no,
              },
            ],
            BACK: "arbeitsweise",
          },
        },
        zahlungslimit: {
          on: {
            SUBMIT: [
              {
                target: "payment-arbeitgeber",
                guard: ({ context }) =>
                  context.amountHigherThan === YesNoAnswer.Values.yes,
              },
              {
                target: "",
                guard: ({ context }) =>
                  context.amountHigherThan === YesNoAnswer.Values.no,
              },
            ],
            BACK: "nachzahlung-arbeitgeber",
          },
        },
        "payment-arbeitgeber": {
          on: {
            SUBMIT: [
              {
                target: "",
                guard: ({ context }) =>
                  context.paymentArbeitgeber ===
                  paymentArbeitgeberType.Values.urlaubsgeld,
              },
              {
                target: "",
                guard: ({ context }) =>
                  context.paymentArbeitgeber ===
                  paymentArbeitgeberType.Values.no,
              },
            ],
            BACK: "zahlungslimit",
          },
        },
      },
    },
  },
} satisfies Config<kontopfaendungWegweiserContext>;
