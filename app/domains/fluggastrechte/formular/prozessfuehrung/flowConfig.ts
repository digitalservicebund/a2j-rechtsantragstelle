import type { FluggastrechteFormularPages } from "../pages";
import type { TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const prozessfuehrungFlowConfig = {
  prozessfuehrungZeugen: "prozessfuehrungMuendlicheVerhandlung",
  prozessfuehrungMuendlicheVerhandlung: "prozessfuehrungVideoverhandlung",
  prozessfuehrungVideoverhandlung: "prozessfuehrungVersaeumnisurteil",
  prozessfuehrungVersaeumnisurteil: "prozessfuehrungZahlung",
  prozessfuehrungZahlung: [
    {
      target: "zusammenfassungStart",
      guard: ({ pageData }) =>
        pageData?.subflowDoneStates?.["/prozessfuehrung"] === true,
    },
  ],
} satisfies Partial<TransitionConfigMap<FluggastrechteFormularPages>>;
