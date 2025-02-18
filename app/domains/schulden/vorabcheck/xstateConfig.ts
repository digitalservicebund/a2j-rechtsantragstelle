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
            target: "Ergebnisseite",
            guard: ({ context }) => context.hasKontopfaendung === "no",
          },
          {
            target: "pKonto",
            guard: ({ context }) => context.hasKontopfaendung === "yes",
          },
          {
            target: "pKonto",
            guard: ({ context }) => context.hasKontopfaendung === "maybe",
          },
        ],
        BACK: "start",
      },
    },
    Ergebnisseite: {
      on: { BACK: "start" },
    },
    pKonto: {
      on: {
        SUBMIT: [
          {
            target: "Ergebnisseite",
            guard: ({ context }) => context.hasPKonto === "no",
          },
          {
            target: "",
            guard: ({ context }) => context.hasPKonto === "yes",
          },
          {
            target: "",
            guard: ({ context }) => context.hasPKonto === "maybe",
          },
        ],
        BACK: "kontopfaendung",
      },
    },
  },
} satisfies Config<kontopfaendungWegweiserContext>;
