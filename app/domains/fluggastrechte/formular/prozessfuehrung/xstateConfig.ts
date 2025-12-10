import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { prozessfuehrungDone } from "./doneFunctions";
import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";

const steps = xStateTargetsFromPagesConfig(fluggastrechteFormularPages);

export const prozessfuehrungXstateConfig = {
  id: "prozessfuehrung",
  initial: steps.prozessfuehrungZeugen.relative,
  states: {
    [steps.prozessfuehrungZeugen.relative]: {
      on: {
        BACK: [
          {
            guard: "isWeiterePersonenYes",
            target: steps.weiterePersonenUebersicht.absolute,
          },
          steps.weiterePersonenFrage.absolute,
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
        SUBMIT: steps.prozessfuehrungZahlung.relative,
        BACK: steps.prozessfuehrungVideoverhandlung.relative,
      },
    },
    [steps.prozessfuehrungZahlung.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.zusammenfassungStart.absolute,
            guard: prozessfuehrungDone,
          },
        ],
        BACK: steps.prozessfuehrungVersaeumnisurteil.relative,
      },
    },
  },
};
