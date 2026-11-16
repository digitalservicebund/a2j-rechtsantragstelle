import { useMemo } from "react";
import { type KlageParteiVerhaeltnis } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import {
  getOrderedKlageParties,
  type KlagePartyWithArrayIndex,
} from "./klagePartyOrdering";

/**
 * Maximum number of klage parteien, per type (person vs org)
 */
export const MAX_KLAGE_PARTIES = 5;

/**
 * Retrieves the appropriate klageParteien data, either for the klagenden or beklagten.
 */
export const useKlageParties = ({
  relationship,
  userData,
}: {
  relationship: KlageParteiVerhaeltnis;
  userData: GeldEinklagenAnwaltschaftUserData;
}): {
  klageParteienWithIndex: KlagePartyWithArrayIndex[];
  nextItemIndex: number;
} => {
  const klageParteienWithIndex = useMemo(
    () => getOrderedKlageParties(userData, relationship),
    [userData, relationship],
  );

  return {
    klageParteienWithIndex,
    nextItemIndex: klageParteienWithIndex.length,
  };
};
