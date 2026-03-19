import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";
import { type FluggastrechteUserData } from "../userData";
import { type Config } from "~/services/flow/server/types";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";

const steps = xStateTargetsFromPagesConfig(fluggastrechteFormularPages);

const showFGROnlineVerfahren = Boolean(
  await isFeatureFlagEnabled("showFGROnlineVerfahren"),
);

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
        SUBMIT: [
          {
            guard: () => showFGROnlineVerfahren,
            target: steps.prozessfuehrungMuendlicheVerhandlung.relative,
          },
          steps.prozessfuehrungVideoverhandlung.relative,
        ],
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
        BACK: [
          {
            guard: () => showFGROnlineVerfahren,
            target: steps.prozessfuehrungMuendlicheVerhandlung.relative,
          },
          steps.prozessfuehrungZeugen.relative,
        ],
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
