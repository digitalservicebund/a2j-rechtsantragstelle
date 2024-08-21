import { GenericGuard } from "~/flows/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { FluggastrechtePersoenlichDaten } from "./context";

export type FluggastrechtePersoenlichDatenGuard =
  GenericGuard<FluggastrechtePersoenlichDaten>;

export const weiterePersonenDone: FluggastrechtePersoenlichDatenGuard = ({
  context: { weiterePersonen },
}) => {
  if (weiterePersonen === undefined || weiterePersonen.length === 0) {
    return true;
  }

  const personenUnter18JahreAlt = weiterePersonen.filter((weiterePerson) => {
    return weiterePerson.unter18JahreAlt === "on";
  });

  if (personenUnter18JahreAlt.length === 0) {
    return true;
  }

  return personenUnter18JahreAlt.some((personUnter18JahreAlt) => {
    return objectKeysNonEmpty(personUnter18JahreAlt, [
      "vornameVertretung",
      "nachnameVertretung",
      "strasseHausnummerVertretung",
      "plzVertretung",
      "ortVertretung",
      "beschreibenVertretung",
    ]);
  });
};
