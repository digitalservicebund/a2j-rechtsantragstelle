import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";
import { type FluggastrechteUserData } from "../userData";
import { type Config } from "~/services/flow/server/types";

const steps = xStateTargetsFromPagesConfig(fluggastrechteFormularPages);

export const prozessfuehrungXstateConfig = {
  id: "prozessfuehrung",
  initial: steps.prozessfuehrungZeugen.relative,
  states: {
    [steps.prozessfuehrungZeugen.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.isWeiterePersonen === "yes",
            target: steps.weiterePersonenUebersicht.absolute,
          },
          steps.weiterePersonenFrage.absolute,
        ],
        SUBMIT: steps.prozessfuehrungMuendlicheVerhandlung.relative,
      },
    },
    [steps.prozessfuehrungMuendlicheVerhandlung.relative]: {
      on: {
        SUBMIT: steps.prozessfuehrungVideoverhandlung.relative,
        BACK: steps.prozessfuehrungZeugen.relative,
      },
    },
    [steps.prozessfuehrungVideoverhandlung.relative]: {
      on: {
        SUBMIT: steps.prozessfuehrungVersaeumnisurteil.relative,
        BACK: steps.prozessfuehrungMuendlicheVerhandlung.relative,
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
            guard: ({ context }) =>
              context.pageData?.subflowDoneStates?.["/prozessfuehrung"] ===
              true,
          },
        ],
        BACK: steps.prozessfuehrungVersaeumnisurteil.relative,
      },
    },
  },
} satisfies Config<FluggastrechteUserData>;
