import z from "zod";
import { autoSuggestStringRequiredSchema } from "~/services/validation/autoSuggest";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

export type KlageParteiVerhaeltnis = "klagende" | "beklagte";
export type KlageParteiType = "natuerliche-person" | "organisation";

export const MAX_NATURAL_PERSON_REPRESENTATIVES = 5;

export const getPluralOfKlageParteiRelationship = (
  relationship: KlageParteiVerhaeltnis,
) => (relationship === "klagende" ? "klagenden" : "beklagten");

const adresseFields = {
  strasse: stringRequiredSchema,
  hausnummer: stringRequiredSchema,
  plz: stringRequiredSchema,
  ort: stringRequiredSchema,
  land: autoSuggestStringRequiredSchema("countries"),
};

const personFields = {
  anrede: schemaOrEmptyString(z.enum(["herr", "frau", "none"])),
  titel: stringOptionalSchema,
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
};

const commonFields = {
  ...adresseFields,
  parteiverhaeltnis: z.enum(["klagende", "beklagte"]),
};

export const vertretungFields = {
  ...adresseFields,
  ...personFields,
};

export const naturalPersonGesetzlicheVertretungArt = z.enum([
  "betreuer-betreuerin",
  "elternteil",
  "pfleger-pflegerin",
  "vormund-vormundin",
  "vorlaeufiger-betreuer-vorlaeufige-betreuerin",
  "sonstige-gesetzliche-vertretung",
]);

export const naturalPersonSchema = z.object({
  ...commonFields,
  ...personFields,
  type: z.literal("natuerliche-person"),
  "gesetzliche-vertretung": z
    .array(
      z.object({
        ...vertretungFields,
        art: naturalPersonGesetzlicheVertretungArt,
      }),
    )
    .max(MAX_NATURAL_PERSON_REPRESENTATIVES)
    .optional(),
});

export const organizationGesetzlicheVertretungArt = z.enum([
  "buergermeister-buergermeisterin",
  "geschaeftsfuehrer-geschaeftsfuehrerin",
  "geschaeftsfuehrender-direktor-geschaeftsfuehrende-direktorin",
  "geschaeftsfuehrender-gesellschafter-geschaeftsfuehrende-gesellschafterin",
  "gesellschafter-gesellschafterin",
  "mitglied-einer-bgb-gesellschaft-als-gesetzliche-vertretung",
  "partner-partnerin",
  "vorstand-vorstaendin",
  "vorstandsvorsitzender-vorstandsvorsitzende",
  "sonstige-organschaftliche-vertretung-hrb",
  "sonstige-gesetzliche-vertretung-bgb",
  "sonstige-gesetzliche-vertretung",
]);

type GesetzlicheVertretungArt =
  | z.infer<typeof naturalPersonGesetzlicheVertretungArt>
  | z.infer<typeof organizationGesetzlicheVertretungArt>;

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

export const organizationSchema = z.object({
  ...commonFields,
  type: z.literal("organisation"),
  orgName: stringRequiredSchema,
  orgVertretungArt: organizationGesetzlicheVertretungArt,
  orgVertretungAnrede: schemaOrEmptyString(z.enum(["herr", "frau", "none"])),
  orgVertretungTitel: stringOptionalSchema,
  orgVertretungVorname: stringRequiredSchema,
  orgVertretungNachname: stringRequiredSchema,
  "gesetzliche-vertretung": z
    .array(
      z.object({
        ...vertretungFields,
        art: organizationGesetzlicheVertretungArt,
      }),
    )
    .optional(),
});

/**
 * Represents a party to a legal case, which can be either a natural person or an organization.
 */
const klageParteiSchema = z.union([naturalPersonSchema, organizationSchema]);

export const klageParteinArraySchema = z.array(klageParteiSchema);

export type KlageParteien = z.infer<typeof klageParteinArraySchema>;
