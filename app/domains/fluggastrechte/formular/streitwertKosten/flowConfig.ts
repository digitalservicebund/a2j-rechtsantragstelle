import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { hasAirlineAddress } from "../../services/airlines/hasAirlineAddress";
import { fromXStateGuard } from "../flowConfigGuards";
import type { FluggastrechteFormularPages } from "../pagesNewFlowEngine";
import { streitwertKostenDone } from "./doneFunctions";

export const streitwertKostenFlowConfig = {
  streitwertKostenGerichtskosten: "streitwertKostenAndereKosten",
  streitwertKostenAndereKosten: "streitwertKostenProzesszinsen",
  streitwertKostenProzesszinsen: [
    {
      target: "flugdatenAdresseFluggesellschaftAuswahl",
      guard: (context) =>
        hasAirlineAddress(context.fluggesellschaft ?? "") &&
        streitwertKostenDone({ context }),
    },
    {
      target: "flugdatenAdresseFluggesellschaft",
      guard: fromXStateGuard(streitwertKostenDone),
    },
  ],
} satisfies Partial<TransitionConfigMap<FluggastrechteFormularPages>>;
