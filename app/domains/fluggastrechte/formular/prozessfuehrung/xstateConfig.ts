import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { prozessfuehrungDone } from "./doneFunctions";
import { fluggastrechteProzessfuehrungPages } from "~/domains/fluggastrechte/formular/prozessfuehrung/pages";

const steps = xStateTargetsFromPagesConfig(fluggastrechteProzessfuehrungPages);

export const prozessfuehrungXstateConfig = {
  meta: { done: prozessfuehrungDone },
  id: "prozessfuehrung",
  initial: "zeugen",
  states: {
    [steps.prozessfuehrungZeugen.relative]: {
      on: {
        BACK: [
          {
            guard: "isWeiterePersonenYes",
            target: "#weitere-personen.uebersicht",
          },
          "#weitere-personen.frage",
        ],
        SUBMIT: steps.prozessfuehrungVideoverhandlung.relative,
      },
    },
    [steps.prozessfuehrungVideoverhandlung.relative]: {
      on: {
        SUBMIT: steps.prozessfuehrungVersaeumnisurteil.relative,
        BACK: steps.prozessfuehrungZeugen.relative,
      },
    },
    [steps.prozessfuehrungVersaeumnisurteil.relative]: {
      on: {
        SUBMIT: "zahlung-nach-klageeinreichung",
        BACK: steps.prozessfuehrungVideoverhandlung.relative,
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
        BACK: steps.prozessfuehrungVersaeumnisurteil.relative,
      },
    },
  },
};
