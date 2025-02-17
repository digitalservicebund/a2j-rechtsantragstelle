import type { Config } from "~/services/flow/server/buildFlowController";
import { kontopfaendungWegweiserContext } from "./context";

export const kontopfaendungWegweiserXstateConfig = {
  id: "/schulden/kontopfaendung/wegweiser",
  initial: "start",
  states: {
    start: {
      on: {
        SUBMIT: "basicinformationen",
      },
    },
    basicinformationen: {
      on: {
        SUBMIT: [
          {
            target: "",
            guard: ({ context }) => context.hasKontopfaendung === "no",
          },
          {
            target: "",
            guard: ({ context }) => context.hasKontopfaendung === "yes",
          },
          {
            target: "",
            guard: ({ context }) => context.hasKontopfaendung === "maybe",
          },
        ],
        BACK: "start",
      },
    },
  },
} satisfies Config<kontopfaendungWegweiserContext>;
