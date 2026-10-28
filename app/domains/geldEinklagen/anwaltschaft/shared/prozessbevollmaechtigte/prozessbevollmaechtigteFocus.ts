import { type KlageParteiVerhaeltnis } from "../klageParties/klagePartySchemas";
import { type ProzessbevollmaechtigteType } from "./prozessbevollmaechtigteSchemas";

export const focusOnProzessbevollmaechtigteTitle = (
  relationship: KlageParteiVerhaeltnis,
  type: ProzessbevollmaechtigteType,
  itemIndex: number,
) => {
  setTimeout(() => {
    const heading =
      document.getElementById(
        `${relationship}-prozessbevollmaechtigte-${itemIndex}`,
      ) ??
      document.getElementById(
        `${relationship}-prozessbevollmaechtigte-${type}`,
      );
    heading?.focus();
  }, 100);
};
