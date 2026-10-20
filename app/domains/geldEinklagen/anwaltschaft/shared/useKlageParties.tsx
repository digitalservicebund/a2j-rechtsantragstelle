import { useMemo } from "react";
import {
  type KlageParteien,
  type KlageParteiVerhaeltnis,
} from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { arrayIsNonEmpty } from "~/util/array";

/**
 * Maximum number of klage parteien, per type (person vs org)
 */
export const MAX_KLAGE_PARTIES = 5;

export type KlagePartyWithArrayIndex = {
  partei: KlageParteien[number];
  arrayIndex: number;
};

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
    klageParteienWithIndex: klageParteien.map((partei, arrayIndex) => ({
      partei,
      arrayIndex,
    })),
    nextItemIndex,
  };
};
