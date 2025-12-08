import type { GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechtePersoenlicheDatenUserData } from "./userData";
import { arrayIsNonEmpty } from "~/util/array";

type FluggastrechtePersoenlicheDatenGuard =
  GenericGuard<FluggastrechtePersoenlicheDatenUserData>;

export const personDone: FluggastrechtePersoenlicheDatenGuard = ({ context }) =>
  objectKeysNonEmpty(context, [
    "vorname",
    "nachname",
    "strasseHausnummer",
    "plz",
    "ort",
  ]);

export const weiterePersonenDone: FluggastrechtePersoenlicheDatenGuard = ({
  context: { weiterePersonen, isWeiterePersonen },
}) => isWeiterePersonen === "no" || arrayIsNonEmpty(weiterePersonen);
