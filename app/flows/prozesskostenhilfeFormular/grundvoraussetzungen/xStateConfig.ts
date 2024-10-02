import type { ProzesskostenhilfeGrundvoraussetzungenContext } from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/context";
import {
  formularIsNachueberpruefung,
  grundvoraussetzungDone,
} from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/context";
import type { Config } from "~/services/flow/server/buildFlowController";

export const grundvoraussetzungenXstateConfig = {
  id: "grundvorsaussetzungen",
  initial: "nachueberpruefung-frage",
  meta: { done: grundvoraussetzungDone },
  states: {
    "nachueberpruefung-frage": {
      on: {
        SUBMIT: [
          {
            guard: formularIsNachueberpruefung,
            target: "nachueberpruefung.name-gericht",
          },
          "antrag.klageersteller",
        ],
        BACK: "#antragStart",
      },
    },
    nachueberpruefung: {
      initial: "name-gericht",
      states: {
        "name-gericht": {
          on: {
            SUBMIT: "aktenzeichen",
            BACK: "#grundvorsaussetzungen.nachueberpruefung-frage",
          },
        },
        aktenzeichen: {
          on: {
            SUBMIT: "#grundvorsaussetzungen.einreichung-fall",
            BACK: "name-gericht",
          },
        },
      },
    },
    antrag: {
      initial: "klageersteller",
      states: {
        klageersteller: {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) =>
                  context.verfahrenArt === "verfahrenSelbststaendig",
                target: "hinweis",
              },
              "#grundvorsaussetzungen.einreichung-fall",
            ],
            BACK: "#grundvorsaussetzungen.nachueberpruefung-frage",
          },
        },
        hinweis: {
          on: {
            SUBMIT: "#grundvorsaussetzungen.einreichung-fall",
            BACK: "klageersteller",
          },
        },
      },
    },
    "einreichung-fall": {
      on: {
        SUBMIT: {},
        BACK: [
          {
            guard: formularIsNachueberpruefung,
            target: "#grundvorsaussetzungen.nachueberpruefung.aktenzeichen",
          },
          {
            guard: ({ context }) => context.verfahrenArt === "verfahrenAnwalt",
            target: "#grundvorsaussetzungen.antrag.klageersteller",
          },
          "#grundvorsaussetzungen.antrag.hinweis",
        ],
      },
    },
  },
} satisfies Config<ProzesskostenhilfeGrundvoraussetzungenContext>;
