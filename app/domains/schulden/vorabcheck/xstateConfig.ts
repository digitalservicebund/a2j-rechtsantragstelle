import type { Config } from "~/services/flow/server/buildFlowController";
import { schuldenZwangsvollstreckungContext } from "./context";

export const schuldenVorabcheckXstateConfig = {
  id: "/schulden/kontopfaendung/wegweiser",
  initial: "basicinformationen",
  states: {
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
        BACK: "basicinformationen",
      },
    },
  },
} satisfies Config<schuldenZwangsvollstreckungContext>;
