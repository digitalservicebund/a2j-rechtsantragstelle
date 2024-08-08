import { Guards, yesNoGuards } from "~/flows/guards.server";
import { FluggastrechtePersoenlichDaten } from "./context";

export const persoenlichDatenGuards = {
  isUnter18JahreAlt: ({ context: { unter18JahreAlt } }) => {
    return unter18JahreAlt === "on";
  },
  ...yesNoGuards("forderungMehrerePersonen"),
  ...yesNoGuards("isProzessbevollmaechtigte"),
} satisfies Guards<FluggastrechtePersoenlichDaten>;
