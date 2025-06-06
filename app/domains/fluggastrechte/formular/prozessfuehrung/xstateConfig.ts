import { prozessfuehrungDone } from "./doneFunctions";

export const prozessfuehrungXstateConfig = {
  meta: { done: prozessfuehrungDone },
  id: "prozessfuehrung",
  initial: "zeugen",
  states: {
    zeugen: {
      on: {
        BACK: [
          {
            guard: "isWeiterePersonenYes",
            target: "#weitere-personen.uebersicht",
          },
          "#weitere-personen.frage",
        ],
        SUBMIT: "videoverhandlung",
      },
    },
    videoverhandlung: {
      on: {
        SUBMIT: "versaeumnisurteil",
        BACK: "zeugen",
      },
    },
    versaeumnisurteil: {
      on: {
        SUBMIT: "zahlung-nach-klageeinreichung",
        BACK: "videoverhandlung",
      },
    },
    "zahlung-nach-klageeinreichung": {
      on: {
        SUBMIT: [
          {
            target: "#zusammenfassung.start",
            guard: "prozessfuehrungDone",
          },
        ],
        BACK: "versaeumnisurteil",
      },
    },
  },
};
