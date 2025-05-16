export const zusammenfassungXstateConfig = {
  meta: { done: () => false },
  id: "zusammenfassung",
  initial: "start",
  states: {
    start: {
      on: {
        SUBMIT: [
          {
            target: "#abgabe.start",
            guard: "isClaimNotExceedingLimit",
          },
        ],
        BACK: "#prozessfuehrung.zahlung-nach-klageeinreichung",
      },
    },
  },
};
