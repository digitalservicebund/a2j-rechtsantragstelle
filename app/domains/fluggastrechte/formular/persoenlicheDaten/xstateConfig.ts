import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { personDone, weiterePersonenDone } from "./doneFunctions";
import { fluggastrechtePersoenlicheDatenPages } from "~/domains/fluggastrechte/formular/persoenlicheDaten/pages";

const steps = xStateTargetsFromPagesConfig(
  fluggastrechtePersoenlicheDatenPages,
);

export const persoenlicheDatenXstateConfig = {
  id: "persoenliche-daten",
  initial: "person",
  states: {
    person: {
      meta: { done: personDone },
      id: "person",
      initial: steps.personDaten.relative,
      states: {
        [steps.personDaten.relative]: {
          on: {
            SUBMIT: {
              guard: "personDone",
              target: steps.weiterePersonenFrage.absolute,
            },
            BACK: "#flugdaten.zusaetzliche-angaben",
          },
        },
      },
    },
    "weitere-personen": {
      meta: { done: weiterePersonenDone, shouldAppearAsMenuNavigation: true },
      id: "weitere-personen",
      initial: steps.weiterePersonenFrage.relative,
      states: {
        frage: {
          on: {
            SUBMIT: [
              {
                guard: "isWeiterePersonenYes",
                target: steps.weiterePersonenUebersicht.relative,
              },
              {
                guard: "weiterePersonenDone",
                target: "#prozessfuehrung.zeugen",
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
                target: "#weitere-personen.warnung",
              },
              {
                guard: "weiterePersonenDone",
                target: "#prozessfuehrung.zeugen",
              },
            ],
            "add-weiterePersonen": {
              guard: "isValidWeiterePersonenArrayIndex",
              target: "person",
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
          },
        },
        warnung: {
          on: {
            BACK: steps.weiterePersonenUebersicht.absolute,
          },
        },
      },
    },
  },
};
