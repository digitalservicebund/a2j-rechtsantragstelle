import { type Guards, yesNoGuards } from "~/flows/guards.server";
import {
  firstArrayIndex,
  isValidArrayIndex,
} from "~/services/flow/pageDataSchema";
import type { FluggastrechtePersoenlichDaten } from "./context";

export const persoenlichDatenGuards = {
  isValidWeiterePersonenArrayIndex: ({
    context: { pageData, weiterePersonen },
  }) => isValidArrayIndex(weiterePersonen, pageData),
  isWeiterePersonensUnter18JahreAlt: ({
    context: { pageData, weiterePersonen },
  }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return weiterePersonen?.at(arrayIndex)?.unter18JahreAlt === "on";
  },
  ...yesNoGuards("isWeiterePersonen"),
} satisfies Guards<FluggastrechtePersoenlichDaten>;
