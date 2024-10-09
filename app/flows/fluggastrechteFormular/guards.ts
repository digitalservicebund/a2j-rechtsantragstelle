import type { FluggastrechtContext } from "./context";
import { type Guards } from "../guards.server";
import { fluggastrechteFlugdatenGuards } from "./flugdaten/guards";
import { grundvorraussetzungenDone } from "./grundvorraussetzungen/doneFunctions";
import { persoenlichDatenGuards } from "./persoenlicheDaten/guards";

export const fluggastrechteGuards = {
  ...fluggastrechteFlugdatenGuards,
  ...persoenlichDatenGuards,
  grundvorraussetzungenDone,
} satisfies Guards<FluggastrechtContext>;
