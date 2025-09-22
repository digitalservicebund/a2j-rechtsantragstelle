import type { Flow } from "~/domains/flows.server";

export const geldEinklagenFormular = {
  flowType: "formFlow",
  stringReplacements: () => ({}),
  config: {
    id: "/geld-einklagen/formular",
    initial: "gericht-pruefen",
    states: {
      "gericht-pruefen": {
        id: "gericht-pruefen",
        initial: "intro",
        states: {
          intro: {
            id: "intro",
            initial: "start",
          },
        },
      },
    },
  },
  guards: {},
} satisfies Flow;
