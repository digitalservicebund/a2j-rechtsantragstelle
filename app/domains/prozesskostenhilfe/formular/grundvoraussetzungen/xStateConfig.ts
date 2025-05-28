import type { ProzesskostenhilfeGrundvoraussetzungenUserData } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/userData";
import type { Config } from "~/services/flow/server/buildFlowController";
import {
  grundvoraussetzungenDone,
  isNachueberpruefung,
  verfahrenAnwalt,
  verfahrenSelbststaendig,
  versandDigitalAnwalt,
  versandDigitalGericht,
} from "./guards";

export const grundvoraussetzungenXstateConfig = {
  id: "grundvorsaussetzungen",
  initial: "nachueberpruefung-frage",
  meta: { done: grundvoraussetzungenDone },
  states: {
    "nachueberpruefung-frage": {
      on: {
        SUBMIT: [
          {
            guard: isNachueberpruefung,
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
                guard: verfahrenSelbststaendig,
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
                guard: isNachueberpruefung,
                target: "#grundvorsaussetzungen.nachueberpruefung.aktenzeichen",
              },
              {
                guard: verfahrenAnwalt,
                target: "#grundvorsaussetzungen.antrag.klageersteller",
              },
              "#grundvorsaussetzungen.antrag.hinweis",
            ],
          },
        },
        mjp: {
          on: {
            SUBMIT: "hinweis-digital-einreichung",
            BACK: "fall",
          },
        },
        "hinweis-papier-einreichung": {
          on: {
            SUBMIT: {
              guard: grundvoraussetzungenDone,
              target: "#antragstellende-person",
            },
            BACK: "fall",
          },
        },
        "hinweis-digital-einreichung": {
          on: {
            SUBMIT: {
              guard: grundvoraussetzungenDone,
              target: "#antragstellende-person",
            },
            BACK: [
              {
                guard: versandDigitalGericht,
                target: "mjp",
              },
              "fall",
            ],
          },
        },
      },
    },
  },
} satisfies Config<ProzesskostenhilfeGrundvoraussetzungenUserData>;
