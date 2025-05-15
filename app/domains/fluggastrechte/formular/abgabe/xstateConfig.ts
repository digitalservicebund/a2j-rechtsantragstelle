export const fluggastrechteAbgabe = {
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
