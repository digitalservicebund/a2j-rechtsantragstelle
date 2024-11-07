import type { GenericGuard } from "~/domains/guards.server";
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
  context: { weiterePersonen, isWeiterePersonen, hasZeugen },
}) => {
  if (typeof hasZeugen === "undefined") {
    return false;
  }

  if (isWeiterePersonen === "no") {
    return true;
  }

  return !(
    typeof weiterePersonen === "undefined" || weiterePersonen.length === 0
  );
};
