export const abgabeXstateConfig = {
  meta: { done: () => false },
  id: "abgabe",
  initial: "start",
  states: {
    start: {
      on: {
        BACK: "#zusammenfassung.start",
      },
    },
  },
};
