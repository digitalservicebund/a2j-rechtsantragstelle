import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { personDone, weiterePersonenDone } from "./doneFunctions";
import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";

const steps = xStateTargetsFromPagesConfig(fluggastrechteFormularPages);

export const persoenlicheDatenXstateConfig = {
  id: "persoenliche-daten",
  initial: "person",
  states: {
    person: {
      id: "person",
      initial: steps.personDaten.relative,
      states: {
        [steps.personDaten.relative]: {
          on: {
            SUBMIT: {
              guard: personDone,
              target: steps.weiterePersonenFrage.absolute,
            },
            BACK: "#flugdaten.zusaetzliche-angaben",
          },
        },
      },
    },
    "weitere-personen": {
      meta: { shouldAppearAsMenuNavigation: true },
      id: "weitere-personen",
      initial: steps.weiterePersonenFrage.relative,
      states: {
        [steps.weiterePersonenFrage.relative]: {
          on: {
            SUBMIT: [
              {
                guard: "isWeiterePersonenYes",
                target: steps.weiterePersonenUebersicht.relative,
              },
              {
                guard: weiterePersonenDone,
                target: steps.prozessfuehrungZeugen.absolute,
              },
            ],
            BACK: steps.personDaten.absolute,
          },
        },
        uebersicht: {
          on: {
            BACK: steps.weiterePersonenFrage.relative,
            SUBMIT: [
              {
                guard: "isMissingAddWeiterePersonen",
                target: steps.weiterePersonenWarnung.absolute,
              },
              {
                guard: "weiterePersonenDone",
                target: steps.prozessfuehrungZeugen.absolute,
              },
            ],
            "add-weiterePersonen": {
              guard: "isValidWeiterePersonenArrayIndex",
              target: "person",
            },
            "add-weiterePersonenAdresse": {
              target: "person.adresse",
            },
          },
        },
        person: {
          initial: steps.personDaten.relative,
          states: {
            daten: {
              on: {
                BACK: steps.weiterePersonenUebersicht.absolute,
                SUBMIT: steps.weiterePersonenUebersicht.absolute,
              },
            },
            adresse: {
              initial: "daten",
              states: {
                daten: {
                  on: {
                    BACK: steps.weiterePersonenUebersicht.absolute,
                    SUBMIT: steps.weiterePersonenUebersicht.absolute,
                  },
                },
              },
            },
          },
        },
        [steps.weiterePersonenWarnung.relative]: {
          on: {
            BACK: steps.weiterePersonenUebersicht.absolute,
          },
        },
      },
    },
  },
};
