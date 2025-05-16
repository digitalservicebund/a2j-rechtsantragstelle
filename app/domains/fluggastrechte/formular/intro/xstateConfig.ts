export const introXstateConfig = {
  id: "intro",
  initial: "start",
  meta: { done: () => true },
  states: {
    start: {
      on: {
        SUBMIT: "#grundvoraussetzungen.datenverarbeitung",
        BACK: "redirect-vorabcheck-ergebnis",
      },
    },
    "redirect-vorabcheck-ergebnis": { on: {} },
  },
};
