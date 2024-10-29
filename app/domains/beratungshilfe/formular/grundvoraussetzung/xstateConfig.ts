import type { Config } from "~/services/flow/server/buildFlowController";
import type { BeratungshilfeGrundvoraussetzungen } from "./context";
import { grundvoraussetzungDone } from "./context";

export const grundvorraussetzungXstateConfig = {
  initial: "start",
  id: "grundvoraussetzungen",
  meta: { done: grundvoraussetzungDone },
  states: {
    start: {
      on: {
        SUBMIT: "rechtsschutzversicherung",
        BACK: "#antragStart",
      },
    },
    rechtsschutzversicherung: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.rechtsschutzversicherung === "no",
            target: "wurde-verklagt",
          },
          {
            target: "rechtsschutzversicherung-hinweis",
          },
        ],
        BACK: "start",
      },
    },
    "rechtsschutzversicherung-hinweis": {
      on: {
        BACK: "rechtsschutzversicherung",
      },
    },
    "wurde-verklagt": {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.wurdeVerklagt === "no",
            target: "klage-eingereicht",
          },
          {
            target: "wurde-verklagt-hinweis",
          },
        ],
        BACK: "rechtsschutzversicherung",
      },
    },
    "wurde-verklagt-hinweis": {
      on: {
        BACK: "wurde-verklagt",
      },
    },
    "klage-eingereicht": {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.klageEingereicht === "no",
            target: "hamburg-oder-bremen",
          },
          {
            target: "klage-eingereicht-hinweis",
          },
        ],
        BACK: "wurde-verklagt",
      },
    },
    "hamburg-oder-bremen": {
      on: {
        SUBMIT: [
          {
            target: "hamburg-oder-bremen-hinweis",
            guard: ({ context }) => context.hamburgOderBremen === "yes",
          },
          "beratungshilfe-beantragt",
        ],
        BACK: "klage-eingereicht",
      },
    },
    "hamburg-oder-bremen-hinweis": {
      on: {
        BACK: "hamburg-oder-bremen",
      },
    },
    "klage-eingereicht-hinweis": {
      on: {
        BACK: "klage-eingereicht",
      },
    },
    "beratungshilfe-beantragt": {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.beratungshilfeBeantragt === "no",
            target: "eigeninitiative-grundvorraussetzung",
          },
          {
            target: "beratungshilfe-beantragt-hinweis",
          },
        ],
        BACK: "hamburg-oder-bremen",
      },
    },
    "beratungshilfe-beantragt-hinweis": {
      on: {
        BACK: "beratungshilfe-beantragt",
      },
    },
    "eigeninitiative-grundvorraussetzung": {
      on: {
        SUBMIT: [
          {
            target: "#anwaltliche-vertretung.start",
            guard: grundvoraussetzungDone,
          },
          {
            target: "eigeninitiative-grundvorraussetzung-hinweis",
          },
        ],
        BACK: "beratungshilfe-beantragt",
      },
    },
    "eigeninitiative-grundvorraussetzung-hinweis": {
      on: {
        BACK: "eigeninitiative-grundvorraussetzung",
      },
    },
  },
} satisfies Config<BeratungshilfeGrundvoraussetzungen>;
