import {
  type GesetzlicheVertretungArt,
  type KlageParteiType,
  type KlageParteiVerhaeltnis,
  getPluralOfKlageParteiRelationship,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { translations } from "~/services/translations/translations";

export const getBaseKlagePartyUrl = (relationship: KlageParteiVerhaeltnis) =>
  `/geld-einklagen/anwaltschaft/${relationship}-partei/${getPluralOfKlageParteiRelationship(relationship)}`;

export const getPartyTypeTranslations = (
  type: KlageParteiType,
  relationship: KlageParteiVerhaeltnis,
) => {
  return type === "natuerliche-person"
    ? {
        heading:
          translations.geldEinklagenAnwaltschaft.natuerlichePersonenHeadline.de,
        addButtonLabel:
          translations.geldEinklagenAnwaltschaft.natuerlichePersonHeadline.de,
        testId: "add-natuerliche-person",
        maximumReachedTitle:
          translations.geldEinklagenAnwaltschaft
            .natuerlichePersonenMaximumReachedTitleNotice.de,
        maximumReachedContent:
          translations.geldEinklagenAnwaltschaft[
            relationship === "klagende"
              ? "natuerlichePersonenMaximumReachedContentNotice"
              : "beklagteNatuerlichePersonenMaximumReachedContentNotice"
          ].de,
      }
    : {
        heading:
          translations.geldEinklagenAnwaltschaft.organisationenHeadline.de,
        helperText:
          translations.geldEinklagenAnwaltschaft.organisationDescription.de,
        addButtonLabel:
          translations.geldEinklagenAnwaltschaft.organisationHeadline.de,
        testId: "add-organisation",
        maximumReachedTitle:
          translations.geldEinklagenAnwaltschaft
            .organisationMaximumReachedTitleNotice.de,
        maximumReachedContent:
          translations.geldEinklagenAnwaltschaft[
            relationship === "klagende"
              ? "organisationMaximumReachedContentNotice"
              : "beklagteOrganisationMaximumReachedContentNotice"
          ].de,
      };
};

const gesetzlicheVertretungArtLabels: Record<GesetzlicheVertretungArt, string> =
  {
    "betreuer-betreuerin": "Betreuer / Betreuerin",
    elternteil: "Elternteil",
    "pfleger-pflegerin": "Pfleger / Pflegerin",
    "vormund-vormundin": "Vormund / Vormundin",
    "vorlaeufiger-betreuer-vorlaeufige-betreuerin":
      "Vorläufiger Betreuer / Vorläufige Betreuerin",
    "sonstige-gesetzliche-vertretung": "Sonstige gesetzliche Vertretung",
    "buergermeister-buergermeisterin": "Bürgermeister / Bürgermeisterin",
    "geschaeftsfuehrer-geschaeftsfuehrerin":
      "Geschäftsführer / Geschäftsführerin",
    "geschaeftsfuehrender-direktor-geschaeftsfuehrende-direktorin":
      "Geschäftsführender Direktor / Geschäftsführende Direktorin",
    "geschaeftsfuehrender-gesellschafter-geschaeftsfuehrende-gesellschafterin":
      "Geschäftsführender Gesellschafter / Geschäftsführende Gesellschafterin",
    "gesellschafter-gesellschafterin": "Gesellschafter / Gesellschafterin",
    "mitglied-einer-bgb-gesellschaft-als-gesetzliche-vertretung":
      "Mitglied einer BGB Gesellschaft als gesetzliche Vertretung",
    "partner-partnerin": "Partner / Partnerin",
    "vorstand-vorstaendin": "Vorstand / Vorständin",
    "vorstandsvorsitzender-vorstandsvorsitzende":
      "Vorstandsvorsitzender / Vorstandsvorsitzende",
    "sonstige-organschaftliche-vertretung-hrb":
      "Sonstige organschaftliche Vertretung HRB",
    "sonstige-gesetzliche-vertretung-bgb":
      "Sonstige gesetzliche Vertretung BGB",
  };

export const getGesetzlicheVertretungArtLabel = (
  art?: GesetzlicheVertretungArt,
) => (art ? gesetzlicheVertretungArtLabels[art] : "");
