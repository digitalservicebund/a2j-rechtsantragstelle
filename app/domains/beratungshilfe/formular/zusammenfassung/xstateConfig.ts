export const zusammenfassungXstateConfig = {
  id: "zusammenfassung",
  initial: "ueberblick",
  meta: { done: () => true },
  states: {
    ueberblick: {
      on: {
        BACK: "#persoenliche-daten.telefonnummer",
        SUBMIT: "#abgabe",
      },
    },
  },
};
