import { useMemo } from "react";
import { type KlageParteiVerhaeltnis } from "../../klageParties/klagePartySchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "../../../userData";
import {
  type BeklagteProzessbevollmaechtigte,
  type Prozessbevollmaechtigte,
} from "./prozessbevollmaechtigteSchemas";

export type ProzessbevollmaechtigteWithArrayIndex = {
  prozessbevollmaechtigte:
    Prozessbevollmaechtigte[number] | BeklagteProzessbevollmaechtigte[number];
  arrayIndex: number;
};

export const useProzessbevollmaechtigte = ({
  relationship,
  userData,
}: {
  relationship: KlageParteiVerhaeltnis;
  userData: GeldEinklagenAnwaltschaftUserData;
}): ProzessbevollmaechtigteWithArrayIndex[] => {
  const prozessbevollmaechtigte = useMemo(
    () =>
      relationship === "klagende"
        ? (userData.klagendeProzessbevollmaechtigte ?? [])
        : (userData.beklagteProzessbevollmaechtigte ?? []),
    [
      relationship,
      userData.klagendeProzessbevollmaechtigte,
      userData.beklagteProzessbevollmaechtigte,
    ],
  );

  return prozessbevollmaechtigte.map((item, arrayIndex) => ({
    prozessbevollmaechtigte: item,
    arrayIndex,
  }));
};
