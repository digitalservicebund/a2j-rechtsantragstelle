import {
  type Hauptantrag,
  type Schmerzensgeldantrag,
} from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import {
  type GesetzlicheVertretungArt,
  type KlageParteiType,
  type KlageParteiVerhaeltnis,
  type KlageParteien,
  getPluralOfKlageParteiRelationship,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { translations } from "~/services/translations/translations";

export const getBaseKlagePartyUrl = (relationship: KlageParteiVerhaeltnis) =>
  `/geld-einklagen/anwaltschaft/${relationship}-partei/${getPluralOfKlageParteiRelationship(relationship)}`;

export const KLAGE_PARTY_DELETION_URL_ENDPOINT =
  "/action/geld-einklagen/anwaltschaft/delete-klage-partei";

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

/**
 * Given all Hauptanträge, get those that are connected to the specified party with a given relationship
 */
export const getConnectedAntraege = (
  partyId: KlageParteien[number]["id"],
  relationship: KlageParteiVerhaeltnis,
  userData: GeldEinklagenAnwaltschaftUserData,
) => {
  const hauptAntraege = [
    ...((userData as GeldEinklagenAnwaltschaftUserData).hauptantrag ?? []),
    ...((userData as GeldEinklagenAnwaltschaftUserData).schmerzengeldantrag ??
      []),
  ];
  const connectedAntraege = hauptAntraege.filter(
    (antrag: Hauptantrag | Schmerzensgeldantrag) =>
      Object.entries(antrag[relationship]).some(
        ([key, value]) => key === partyId && value === "on",
      ),
  );
  return connectedAntraege;
};

/**
 * Filter function to determine if a given antrag has only one party of the specified relationship
 */
export const antragHasOnlyOneParty =
  (relationship: KlageParteiVerhaeltnis) =>
  (antrag: Hauptantrag | Schmerzensgeldantrag) =>
    Object.keys(antrag[relationship]).filter(
      (key) => antrag[relationship][key] === "on",
    ).length === 1;
