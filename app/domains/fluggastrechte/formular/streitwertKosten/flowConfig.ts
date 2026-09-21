import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { hasAirlineAddress } from "../../services/airlines/hasAirlineAddress";
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
        streitwertKostenDone(context),
    },
    {
      target: "flugdatenAdresseFluggesellschaft",
      guard: streitwertKostenDone,
    },
  ],
} satisfies Partial<TransitionConfigMap<FluggastrechteFormularPages>>;
