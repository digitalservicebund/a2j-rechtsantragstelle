import { GenericGuard } from "~/flows/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { FluggastrechtePersoenlichDaten } from "./context";

export type FluggastrechtePersoenlichDatenGuard =
  GenericGuard<FluggastrechtePersoenlichDaten>;

const hasPersonVollmaechtigteData: FluggastrechtePersoenlichDatenGuard = ({
  context,
}) => {
  const { isProzessbevollmaechtigte } = context;
  if (isProzessbevollmaechtigte === "no") {
    return true;
  }

  return objectKeysNonEmpty(context, [
    "vornameVollmaechtigte",
    "vollmaechtigteNachname",
  ]);
};

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

  const hasPersonVertretung = hasPersonVertretungData({ context });
  const hasVollmaechtigte = hasPersonVollmaechtigteData({ context });

  return hasPersonData && hasPersonVertretung && hasVollmaechtigte;
};

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
