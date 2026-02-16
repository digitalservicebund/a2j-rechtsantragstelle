import { type Guards, yesNoGuards } from "~/domains/guards.server";
import { isValidArrayIndex } from "~/services/flow/pageDataSchema";
import { weiterePersonenDone } from "./doneFunctions";
import type { FluggastrechtePersoenlicheDatenUserData } from "./userData";

export const persoenlichDatenGuards = {
  isValidWeiterePersonenArrayIndex: ({
    context: { pageData, weiterePersonen },
  }) => isValidArrayIndex(weiterePersonen, pageData),
  ...yesNoGuards("isWeiterePersonen"),
  isMissingAddWeiterePersonen: (context) => !weiterePersonenDone(context),
} satisfies Guards<FluggastrechtePersoenlicheDatenUserData>;
