import type { FluggastrechtContext } from "./context";
import { fluggastrechteFlugdatenGuards } from "./flugdaten/guards";
import { Guards, yesNoGuards } from "../guards.server";

export const fluggastrechteGuards = {
  ...fluggastrechteFlugdatenGuards,
  ...yesNoGuards("zwischenstopps"),
} satisfies Guards<FluggastrechtContext>;
