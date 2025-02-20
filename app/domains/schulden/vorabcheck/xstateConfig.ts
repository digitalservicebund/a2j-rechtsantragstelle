import type { Config } from "~/services/flow/server/buildFlowController";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  euroSchwelleType,
  kontopfaendungType,
  kontopfaendungWegweiserContext,
  pKontoType,
  schuldenBeiType,
  verheiratetType,
} from "./context";

export const kontopfaendungWegweiserXstateConfig = {
  id: "/schulden/kontopfaendung/wegweiser",
  initial: "abfrageBasisInfos",
  states: {
    abfrageBasisInfos: {
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
                target: "pKonto",
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
        pKonto: {
          on: {
            SUBMIT: [
              {
                target: "pKonto-probleme",
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
        "pKonto-probleme": {
          on: {
            SUBMIT: [
              {
                target: "glaeubiger",
              },
            ],
            BACK: "pKonto",
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
            BACK: "pKonto",
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
            BACK: "#/schulden/kontopfaendung/wegweiser.abfrageBasisInfos.euro-schwelle",
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
                target: "natural",
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
        natural: {
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
          },
        },
        partner: {
          on: {
            SUBMIT: [
              {
                target: "zusammenwohnen",
                guard: ({ context }) =>
                  context.verheiratet !== verheiratetType.Values.nein,
              },
              {
                target: "partner-support",
                guard: ({ context }) =>
                  context.verheiratet === verheiratetType.Values.nein,
              },
            ],
            BACK: "kinder",
          },
        },
        zusammenwohnen: {
          on: {
            SUBMIT: "partner-support",
            BACK: "partner",
          },
        },
        "partner-support": {
          on: {
            SUBMIT: "",
            BACK: "zusammenwohnen",
          },
        },
      },
    },
  },
} satisfies Config<kontopfaendungWegweiserContext>;
