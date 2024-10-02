import type { ProzesskostenhilfeGrundvoraussetzungenContext } from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/context";
import {
  formularIsNachueberpruefung,
  grundvoraussetzungDone,
  shouldUseMJP,
  versandDigitalAnwalt,
  versandDigitalGericht,
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
            SUBMIT: "#grundvorsaussetzungen.einreichung",
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
              "#grundvorsaussetzungen.einreichung",
            ],
            BACK: "#grundvorsaussetzungen.nachueberpruefung-frage",
          },
        },
        hinweis: {
          on: {
            SUBMIT: "#grundvorsaussetzungen.einreichung",
            BACK: "klageersteller",
          },
        },
      },
    },
    einreichung: {
      initial: "fall",
      states: {
        fall: {
          on: {
            SUBMIT: [
              {
                guard: versandDigitalAnwalt,
                target: "hinweis-digital-einreichung",
              },
              {
                guard: versandDigitalGericht,
                target: "mjp",
              },
              "hinweis-papier-einreichung",
            ],
            BACK: [
              {
                guard: formularIsNachueberpruefung,
                target: "#grundvorsaussetzungen.nachueberpruefung.aktenzeichen",
              },
              {
                guard: ({ context }) =>
                  context.verfahrenArt === "verfahrenAnwalt",
                target: "#grundvorsaussetzungen.antrag.klageersteller",
              },
              "#grundvorsaussetzungen.antrag.hinweis",
            ],
          },
        },
        mjp: {
          on: {
            SUBMIT: [
              {
                guard: shouldUseMJP,
                target: "hinweis-digital-einreichung",
              },
              "hinweis-papier-einreichung",
            ],
            BACK: "fall",
          },
        },
        "hinweis-papier-einreichung": {
          on: {
            SUBMIT: "#finanzielle-angaben", // TODO: replace w/ Antragstellende when finished
            BACK: [
              {
                guard: versandDigitalGericht,
                target: "mjp",
              },
              "fall",
            ],
          },
        },
        "hinweis-digital-einreichung": {
          on: {
            SUBMIT: "#finanzielle-angaben", // TODO: replace w/ Antragstellende when finished
            BACK: [
              {
                guard: shouldUseMJP,
                target: "mjp",
              },
              "fall",
            ],
          },
        },
      },
    },
  },
} satisfies Config<ProzesskostenhilfeGrundvoraussetzungenContext>;
