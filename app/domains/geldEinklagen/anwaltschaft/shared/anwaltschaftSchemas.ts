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

const vertretungFields = {
  ...adresseFields,
  ...personFields,
};

export const naturalPersonGesetzlicheVertretungArt = z.enum([
  "Betreuer / Betreuerin",
  "Elternteil",
  "Pfleger / Pflegerin",
  "Vormund / Vormundin",
  "Vorläufiger Betreuer / Vorläufige Betreuerin",
  "Sonstige gesetzliche Vertretung",
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

export type KlagendeNaturalPerson = z.infer<typeof naturalPersonSchema>;

export const organizationGesetzlicheVertretungArt = z.enum([
  "Bürgermeister / Bürgermeisterin",
  "Geschäftsführer / Geschäftsführerin",
  "Geschäftsführender Direktor / Geschäftsführende Direktorin",
  "Geschäftsführender Gesellschafter / Geschäftsführende Gesellschafterin",
  "Gesellschafter / Gesellschafterin",
  "Mitglied einer BGB Gesellschaft als gesetzliche Vertretung",
  "Partner / Partnerin",
  "Vorstand / Vorständin",
  "Vorstandsvorsitzender / Vorstandsvorsitzende",
  "Sonstige organschaftliche Vertretung HRB",
  "Sonstige gesetzliche Vertretung BGB",
  "Sonstige gesetzliche Vertretung",
]);

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
