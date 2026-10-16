import { useMemo } from "react";
import { type KlageParteiVerhaeltnis } from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { type KlageParteienContext } from "~/domains/geldEinklagen/anwaltschaft/shared/components/KlageParteienContext";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { arrayIsNonEmpty } from "~/util/array";

/**
 * Maximum number of klage parteien, per type (person vs org)
 */
export const MAX_KLAGE_PARTEIEN = 5;

/**
 * Retrieves the appropriate klageParteien data, either for the klagenden or beklagten.
 */
export const useKlageParteien = ({
  relationship,
  userData,
}: {
  relationship: KlageParteiVerhaeltnis;
  userData: GeldEinklagenAnwaltschaftUserData;
}): {
  klageParteien: KlageParteienContext;
  nextItemIndex: number;
} => {
  const klageParteien = useMemo(
    () =>
      relationship === "klagende"
        ? (userData.klagenden ?? [])
        : (userData.beklagten ?? []),
    [userData.klagenden, userData.beklagten, relationship],
  );

  const nextItemIndex = arrayIsNonEmpty(klageParteien)
    ? (klageParteien.length ?? 0)
    : 0;

  return {
    klageParteien: {
      naturalPersonen: klageParteien.filter(
        (partei) => partei.type === "natuerliche-person",
      ),
      organizations: klageParteien.filter(
        (partei) => partei.type === "organisation",
      ),
    },
    nextItemIndex,
  };
};
