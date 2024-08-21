import { Guards, yesNoGuards } from "~/flows/guards.server";
import { isValidArrayIndex } from "~/services/flow/pageDataSchema";
import { FluggastrechtePersoenlichDaten } from "./context";

export const persoenlichDatenGuards = {
  isUnter18JahreAlt: ({ context: { unter18JahreAlt } }) => {
    return unter18JahreAlt === "on";
  },
  isValidWeiterePersonenArrayIndex: ({
    context: { pageData, weiterePersonen },
  }) => isValidArrayIndex(weiterePersonen, pageData),
  ...yesNoGuards("isProzessbevollmaechtigte"),
} satisfies Guards<FluggastrechtePersoenlichDaten>;
