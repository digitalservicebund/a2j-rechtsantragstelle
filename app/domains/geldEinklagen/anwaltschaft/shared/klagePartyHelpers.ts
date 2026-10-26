import {
  type KlageParteiType,
  type KlageParteiVerhaeltnis,
  getPluralOfKlageParteiRelationship,
} from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
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
