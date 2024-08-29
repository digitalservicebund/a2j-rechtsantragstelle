import type { GenericGuard } from "~/flows/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechtContext } from "../context";

export type FluggastrechteGrundvorraussetzungenDaten =
  GenericGuard<FluggastrechtContext>;

export const grundvorraussetzungenDone: FluggastrechteGrundvorraussetzungenDaten =
  ({ context }) => {
    return objectKeysNonEmpty(context, [
      "startAirport",
      "endAirport",
      "bereich",
      "fluggesellschaft",
    ]);
  };
