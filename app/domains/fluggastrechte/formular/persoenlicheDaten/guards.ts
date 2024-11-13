import { type Guards, yesNoGuards } from "~/domains/guards.server";
import { isValidArrayIndex } from "~/services/flow/pageDataSchema";
import type { FluggastrechtePersoenlichDaten } from "./context";
import { personDone, weiterePersonenDone } from "./doneFunctions";

export const persoenlichDatenGuards = {
  isValidWeiterePersonenArrayIndex: ({
    context: { pageData, weiterePersonen },
  }) => isValidArrayIndex(weiterePersonen, pageData),
  ...yesNoGuards("isWeiterePersonen"),
  persoenlichenDatenDone: ({ context }) =>
    personDone({ context }) && weiterePersonenDone({ context }),
} satisfies Guards<FluggastrechtePersoenlichDaten>;
