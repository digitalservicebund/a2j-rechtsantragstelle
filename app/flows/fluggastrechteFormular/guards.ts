import type { FluggastrechtContext } from "./context";
import { fluggastrechteDirekterFlugGuards } from "./flugdaten/guards";
import { Guards, yesNoGuards } from "../guards.server";

export const fluggastrechteGuards = {
  ...fluggastrechteDirekterFlugGuards,
  ...yesNoGuards("zwischenstopps"),
  ...yesNoGuards("ankunftWithSameFlight"),
} satisfies Guards<FluggastrechtContext>;
