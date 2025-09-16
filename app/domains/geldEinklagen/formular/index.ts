import type { Flow } from "~/domains/flows.server";

export const geldEinklagenFormular = {
  flowType: "formFlow",
  stringReplacements: () => ({}),
  useStepper: true,
  config: {
    id: "/geld-einklagen/formular",
    initial: "gericht-pruefen",
    states: {
      "gericht-pruefen": {
        id: "gericht-pruefen",
        initial: "intro",
        states: {
          intro: {
            id: "intro",
            initial: "start",
            states: {
              start: {
                on: {
                  SUBMIT: "#forderung.intro",
                },
              },
            },
          },
          forderung: {
            id: "forderung",
            initial: "intro",
            states: {
              intro: {
                id: "intro",
                initial: "start",
                states: {
                  start: {
                    on: {
                      SUBMIT: "#forderung.intro.details",
                      BACK: "#gericht-pruefen.intro.start",
                    },
                  },
                  details: {
                    on: {
                      SUBMIT: "#forderung.manual.start",
                      BACK: "#forderung.intro.start",
                    },
                  },
                },
              },
              manual: {
                id: "manual",
                initial: "start",
                states: {
                  start: {
                    on: {
                      SUBMIT: "#klage.intro.start",
                      BACK: "#forderung.intro.details",
                    },
                  },
                },
              },
            },
          },
        },
      },
      klage: {
        id: "klage",
        initial: "intro",
        states: {
          intro: {
            id: "intro",
            initial: "start",
            states: {
              start: {
                on: {
                  SUBMIT: "#abgabe.intro.start",
                  BACK: "#gericht-pruefen.forderung.manual.start",
                },
              },
            },
          },
        },
      },
      abgabe: {
        id: "abgabe",
        initial: "intro",
        states: {
          intro: {
            id: "intro",
            initial: "start",
            states: {
              start: {
                on: {
                  BACK: "#klage.intro.start",
                },
              },
            },
          },
        },
      },
    },
  },
  guards: {},
} satisfies Flow;
