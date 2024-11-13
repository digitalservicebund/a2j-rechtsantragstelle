import type { FluggastrechtContext } from "./context";
import { type Guards } from "../../guards.server";
import { fluggastrechteFlugdatenGuards } from "./flugdaten/guards";
import { grundvoraussetzungenDone } from "./grundvoraussetzungen/doneFunctions";
import { persoenlichDatenGuards } from "./persoenlicheDaten/guards";
import { prozessfuehrungDone } from "./prozessfuehrung/doneFunctions";
import { streitwertKostenDone } from "./streitwertKosten/doneFunctions";

export const fluggastrechteGuards = {
  ...fluggastrechteFlugdatenGuards,
  ...persoenlichDatenGuards,
  grundvoraussetzungenDone,
  streitwertKostenDone,
  prozessfuehrungDone,
} satisfies Guards<FluggastrechtContext>;
