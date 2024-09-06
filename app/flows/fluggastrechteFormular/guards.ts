import type { FluggastrechtContext } from "./context";
import { type Guards } from "../guards.server";
import { fluggastrechteFlugdatenGuards } from "./flugdaten/guards";
import { persoenlichDatenGuards } from "./persoenlicheDaten/guards";

export const fluggastrechteGuards = {
  ...fluggastrechteFlugdatenGuards,
  ...persoenlichDatenGuards,
} satisfies Guards<FluggastrechtContext>;
