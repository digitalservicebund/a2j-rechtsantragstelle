import { type Guards, yesNoGuards } from "~/flows/guards.server";
import { isValidArrayIndex } from "~/services/flow/pageDataSchema";
import type { FluggastrechtePersoenlichDaten } from "./context";

export const persoenlichDatenGuards = {
  isValidWeiterePersonenArrayIndex: ({
    context: { pageData, weiterePersonen },
  }) => isValidArrayIndex(weiterePersonen, pageData),
  ...yesNoGuards("isWeiterePersonen"),
} satisfies Guards<FluggastrechtePersoenlichDaten>;
