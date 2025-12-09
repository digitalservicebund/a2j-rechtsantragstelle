import { type Guards, yesNoGuards } from "~/domains/guards.server";
import { isValidArrayIndex } from "~/services/flow/pageDataSchema";
import { personDone, weiterePersonenDone } from "./doneFunctions";
import type { FluggastrechtePersoenlicheDatenUserData } from "./userData";

export const persoenlichDatenGuards = {
  isValidWeiterePersonenArrayIndex: ({
    context: { pageData, weiterePersonen },
  }) => isValidArrayIndex(weiterePersonen, pageData),
  ...yesNoGuards("isWeiterePersonen"),
  personDone,
  weiterePersonenDone,
  isMissingAddWeiterePersonen: (context) => !weiterePersonenDone(context),
} satisfies Guards<FluggastrechtePersoenlicheDatenUserData>;
