import type { FluggastrechtContext } from "./context";
import { fluggastrechteFlugDatenGuards } from "./flugdaten/guards";
import { Guards, yesNoGuards } from "../guards.server";

export const fluggastrechteGuards = {
  ...fluggastrechteFlugDatenGuards,
  ...yesNoGuards("zwischenstopps"),
} satisfies Guards<FluggastrechtContext>;
