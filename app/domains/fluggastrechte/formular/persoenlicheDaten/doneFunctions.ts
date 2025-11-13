import type { GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechtePersoenlichDaten } from "./userData";
import { arrayIsNonEmpty } from "~/util/array";

type FluggastrechtePersoenlichDatenGuard =
  GenericGuard<FluggastrechtePersoenlichDaten>;

export const personDone: FluggastrechtePersoenlichDatenGuard = ({ context }) =>
  objectKeysNonEmpty(context, [
    "vorname",
    "nachname",
    "strasseHausnummer",
    "plz",
    "ort",
  ]);

export const weiterePersonenDone: FluggastrechtePersoenlichDatenGuard = ({
  context: { weiterePersonen, isWeiterePersonen },
}) => isWeiterePersonen === "no" || arrayIsNonEmpty(weiterePersonen);
