import { type KlageParteiVerhaeltnis } from "../klageParties/klagePartySchemas";

export const getProzessbevollmaechtigteArrayName = (
  relationship: KlageParteiVerhaeltnis,
) =>
  relationship === "klagende"
    ? "klagendeProzessbevollmaechtigte"
    : "beklagteProzessbevollmaechtigte";

export const getBaseProzessbevollmaechtigteUrl = (
  relationship: KlageParteiVerhaeltnis,
) =>
  `/geld-einklagen/anwaltschaft/${relationship}-partei/prozessbevollmaechtigte`;
