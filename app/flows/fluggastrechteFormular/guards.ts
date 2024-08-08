import type { FluggastrechtContext } from "./context";
import { fluggastrechteFlugdatenGuards } from "./flugdaten/guards";
import { persoenlichDatenGuards } from "./persoenlicheDaten/guards";
import { Guards, yesNoGuards } from "../guards.server";

export const fluggastrechteGuards = {
  ...fluggastrechteFlugdatenGuards,
  ...persoenlichDatenGuards,
  ...yesNoGuards("zwischenstopps"),
} satisfies Guards<FluggastrechtContext>;
