import type { GenericGuard } from "~/flows/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechtePersoenlichDaten } from "./context";

export type FluggastrechtePersoenlichDatenGuard =
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
}) => {
  if (isWeiterePersonen === "no") {
    return true;
  }

  return !(
    typeof weiterePersonen === "undefined" || weiterePersonen.length === 0
  );
};
