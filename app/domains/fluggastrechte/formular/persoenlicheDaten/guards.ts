import { isValidArrayIndex } from "~/services/flow/pageData";
import { weiterePersonenDone } from "./doneFunctions";
import type { FluggastrechtePersoenlicheDatenUserData } from "./userData";

export const persoenlichDatenGuards = {
  isValidWeiterePersonenArrayIndex: ({
    pageData,
    weiterePersonen,
  }: FluggastrechtePersoenlicheDatenUserData) =>
    isValidArrayIndex(weiterePersonen, pageData),
  isWeiterePersonenYes: ({
    isWeiterePersonen,
  }: FluggastrechtePersoenlicheDatenUserData) => isWeiterePersonen === "yes",
  isMissingAddWeiterePersonen: (context) => !weiterePersonenDone(context),
} satisfies Record<
  string,
  (context: FluggastrechtePersoenlicheDatenUserData) => boolean
>;
