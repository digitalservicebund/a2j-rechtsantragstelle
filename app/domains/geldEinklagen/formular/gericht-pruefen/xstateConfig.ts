export const gerichtPruefenXstateConfig = {
  id: "gericht-pruefen",
  initial: "intro",
  meta: { done: () => true },
  states: {
    intro: {
      id: "intro",
      initial: "start",
      states: {
        start: {
          on: {},
        },
      },
    },
  },
};
