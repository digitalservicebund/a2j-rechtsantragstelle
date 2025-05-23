export const zusammenfassungXstateConfig = {
  id: "zusammenfassung",
  initial: "ueberblick",
  meta: { done: () => false },
  states: {
    ueberblick: {
      on: {
        BACK: "#weitere-angaben",
        SUBMIT: "#abgabe",
      },
    },
  },
};
