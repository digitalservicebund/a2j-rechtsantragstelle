import { translations } from "~/services/translations/translations";
import { type KlageParteiVerhaeltnis } from "../../klageParties/klagePartySchemas";

export const MAX_PROZESSBEVOLLMAECHTIGTE = 1;
export const MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS = 5;

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

export const getProzessbevollmaechtigteTranslations = (
  isBerufsausuebungsgesellschaft: boolean = false,
) => {
  return {
    deleteButtonLabel:
      translations.geldEinklagenAnwaltschaft[
        isBerufsausuebungsgesellschaft
          ? "berufsausuebungsgesellschaftHeadline"
          : "einzelkanzleiHeadline"
      ].de,
    deleteButtonTitle:
      translations.geldEinklagenAnwaltschaft[
        isBerufsausuebungsgesellschaft
          ? "berufsausuebungsgesellschaftDeleteTitle"
          : "einzelkanzleiDeleteTitle"
      ].de,
    deleteButtonDescription:
      translations.geldEinklagenAnwaltschaft[
        isBerufsausuebungsgesellschaft
          ? "berufsausuebungsgesellschaftDeleteDescription"
          : "einzelkanzleiDeleteDescription"
      ].de,
  };
};
