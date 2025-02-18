import type { Config } from "~/services/flow/server/buildFlowController";
import { kontopfaendungWegweiserContext } from "./context";

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
            guard: ({ context }) => context.hasKontopfaendung === "no",
          },
          {
            target: "pKonto",
            guard: ({ context }) => context.hasKontopfaendung === "yes",
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
            guard: ({ context }) => context.hasPKonto === "no",
          },
          {
            target: "glaeubiger",
            guard: ({ context }) => context.hasPKonto === "yes",
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
              context.schuldenBei === "glaeubigerin-unbekannt",
          },
          {
            target: "euro-schwelle",
            guard: ({ context }) =>
              context.schuldenBei !== "glaeubigerin-unbekannt",
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
        BACK: "pKonto",
      },
    },
    "euro-schwelle": {
      on: {
        SUBMIT: [
          {
            target: "ergebnisseite",
            guard: ({ context }) => context.euroSchwelle === "no",
          },
          {
            target: "",
            guard: ({ context }) => context.euroSchwelle === "yes",
          },
        ],
        BACK: "glaeubiger",
      },
    },
  },
} satisfies Config<kontopfaendungWegweiserContext>;
