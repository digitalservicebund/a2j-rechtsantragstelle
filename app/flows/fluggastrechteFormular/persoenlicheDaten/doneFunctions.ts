import type { GenericGuard } from "~/flows/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechtePersoenlichDaten } from "./context";

export type FluggastrechtePersoenlichDatenGuard =
  GenericGuard<FluggastrechtePersoenlichDaten>;

const hasPersonVertretungData: FluggastrechtePersoenlichDatenGuard = ({
  context,
}) => {
  const { unter18JahreAlt } = context;

  if (unter18JahreAlt === "off") {
    return true;
  }

  return objectKeysNonEmpty(context, [
    "vornameVertretung",
    "nachnameVertretung",
    "strasseHausnummer",
    "strasseHausnummerVertretung",
    "plzVertretung",
    "ortVertretung",
    "beschreibenVertretung",
  ]);
};

export const personDone: FluggastrechtePersoenlichDatenGuard = ({
  context,
}) => {
  const hasPersonData = objectKeysNonEmpty(context, [
    "vorname",
    "nachname",
    "strasseHausnummer",
    "plz",
    "ort",
  ]);

  return hasPersonData;
};

export const weiterePersonenDone: FluggastrechtePersoenlichDatenGuard = ({
  context: { weiterePersonen, isWeiterePersonen },
}) => {
  if (isWeiterePersonen === "no") {
    return true;
  }

  if (typeof weiterePersonen === "undefined" || weiterePersonen.length === 0) {
    return false;
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
