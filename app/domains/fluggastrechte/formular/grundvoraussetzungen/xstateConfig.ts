import { grundvoraussetzungenDone } from "./doneFunctions";

export const grundvoraussetzungenXstateConfig = {
  meta: { done: grundvoraussetzungenDone },
  id: "grundvoraussetzungen",
  initial: "datenverarbeitung",
  states: {
    datenverarbeitung: {
      on: {
        SUBMIT: "streitbeilegung",
        BACK: "#intro.start",
      },
    },
    streitbeilegung: {
      on: {
        SUBMIT: [
          {
            target: "streitbeilegung-gruende",
            guard: "hasNoStreitbeilegung",
          },
          "prozessfaehig",
        ],
        BACK: "datenverarbeitung",
      },
    },
    "streitbeilegung-gruende": {
      on: {
        SUBMIT: "prozessfaehig",
        BACK: "streitbeilegung",
      },
    },
    prozessfaehig: {
      on: {
        SUBMIT: "ausgleichszahlung",
        BACK: [
          {
            target: "streitbeilegung-gruende",
            guard: "hasNoStreitbeilegung",
          },
          "streitbeilegung",
        ],
      },
    },
    ausgleichszahlung: {
      on: {
        SUBMIT: "daten-uebernahme",
        BACK: "prozessfaehig",
      },
    },
    "daten-uebernahme": {
      on: {
        SUBMIT: "amtsgericht",
        BACK: "ausgleichszahlung",
      },
    },
    amtsgericht: {
      on: {
        SUBMIT: [
          {
            target: "#streitwert-kosten.gerichtskosten",
            guard: "grundvoraussetzungenDone",
          },
        ],
        BACK: "daten-uebernahme",
      },
    },
  },
};
