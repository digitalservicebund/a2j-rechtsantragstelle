import { personDone, weiterePersonenDone } from "./doneFunctions";

export const persoenlicheDatenXstateConfig = {
  id: "persoenliche-daten",
  initial: "person",
  states: {
    person: {
      meta: { done: personDone },
      id: "person",
      initial: "daten",
      states: {
        daten: {
          on: {
            SUBMIT: {
              guard: "personDone",
              target: "#weitere-personen.frage",
            },
            BACK: "#flugdaten.zusaetzliche-angaben",
          },
        },
      },
    },
    "weitere-personen": {
      meta: { done: weiterePersonenDone },
      id: "weitere-personen",
      initial: "frage",
      states: {
        frage: {
          on: {
            SUBMIT: [
              {
                guard: "isWeiterePersonenYes",
                target: "uebersicht",
              },
              {
                guard: "weiterePersonenDone",
                target: "#prozessfuehrung.zeugen",
              },
            ],
            BACK: "#person.daten",
          },
        },
        uebersicht: {
          on: {
            BACK: "frage",
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
          initial: "daten",
          states: {
            daten: {
              on: {
                BACK: "#weitere-personen.uebersicht",
                SUBMIT: "#weitere-personen.uebersicht",
              },
            },
          },
        },
        warnung: {
          on: {
            BACK: "#weitere-personen.uebersicht",
          },
        },
      },
    },
  },
};
