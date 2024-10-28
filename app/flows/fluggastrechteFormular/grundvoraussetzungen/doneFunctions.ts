import type { GenericGuard } from "~/flows/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechtContext } from "../context";

export type FluggastrechteGrundvoraussetzungenDaten =
  GenericGuard<FluggastrechtContext>;

export const grundvoraussetzungenDone: FluggastrechteGrundvoraussetzungenDaten =
  ({ context }) => {
    return objectKeysNonEmpty(context, [
      "startAirport",
      "endAirport",
      "bereich",
      "fluggesellschaft",
      "zahlungsaufforderung",
    ]);
  };
