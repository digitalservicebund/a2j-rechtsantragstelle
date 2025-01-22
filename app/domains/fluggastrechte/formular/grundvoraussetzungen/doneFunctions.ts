import type { GenericGuard } from "~/domains/guards.server";
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
      "datenverarbeitungZustimmung",
    ]);
  };
