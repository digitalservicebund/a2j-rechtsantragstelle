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
            guard: ({ context }) => context.basicinformationen === "no",
          },
          {
            target: "",
            guard: ({ context }) => context.basicinformationen === "yes",
          },
          {
            target: "",
            guard: ({ context }) => context.basicinformationen === "maybe",
          },
        ],
        BACK: "start",
      },
    },
  },
} satisfies Config<kontopfaendungWegweiserContext>;
