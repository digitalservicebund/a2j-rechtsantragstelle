import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import type {
  KlageParteien,
  KlageParteiVerhaeltnis,
} from "./klagePartySchemas";

export type KlagePartyWithArrayIndex = {
  partei: KlageParteien[number];
  arrayIndex: number;
  displayIndex: number;
};

/**
 * Shared UI/PDF order: natural persons before organizations, preserving source
 * order within each type. Display indexes are zero-based; array indexes are
 * retained for existing edit/delete routes.
 */
export const getOrderedKlageParties = (
  userData: Pick<GeldEinklagenAnwaltschaftUserData, "klagenden" | "beklagten">,
  relationship: KlageParteiVerhaeltnis,
): KlagePartyWithArrayIndex[] => {
  const parties =
    (relationship === "klagende" ? userData.klagenden : userData.beklagten) ??
    [];
  const indexedParties = parties.map((partei, arrayIndex) => ({
    partei,
    arrayIndex,
  }));
  return [
    ...indexedParties.filter(
      ({ partei }) => partei.type === "natuerliche-person",
    ),
    ...indexedParties.filter(({ partei }) => partei.type === "organisation"),
  ].map((party, displayIndex) => ({ ...party, displayIndex }));
};
