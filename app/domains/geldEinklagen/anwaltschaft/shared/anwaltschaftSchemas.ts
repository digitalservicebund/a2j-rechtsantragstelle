import z from "zod";
import { autoSuggestStringRequiredSchema } from "~/services/validation/autoSuggest";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

export type KlageParteiVerhaeltnis = "klagende" | "beklagte";
export type KlageParteiType = "natuerliche-person" | "organisation";

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
  index: z.number().min(1),
};

const vertretungFields = {
  ...adresseFields,
  ...personFields,
};

export const naturalPersonSchema = z.object({
  ...commonFields,
  ...personFields,
  type: z.literal("natuerliche-person"),
  weitereVertretung: z.array(
    z.object({
      ...vertretungFields,
      art: z.enum([
        "Betreuer / Betreuerin",
        "Elternteil",
        "Pfleger / Pflegerin",
        "Vormund / Vormundin",
        "Vorläufiger Betreuer / Vorläufige Betreuerin",
        "Sonstige gesetzliche Vertretung",
      ]),
    }),
  ),
});

const organizationSchema = z.object({
  ...commonFields,
  type: z.literal("organisation"),
  orgName: stringRequiredSchema,
  orgVertretungArt: z.enum([
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
  ]),
  orgVertretungAnrede: schemaOrEmptyString(z.enum(["herr", "frau", "none"])),
  orgVertretungTitel: stringOptionalSchema,
  orgVertretungVorname: stringRequiredSchema,
  orgVertretungNachname: stringRequiredSchema,
  weitereVertretung: z.array(
    z.object({
      ...vertretungFields,
      art: z.enum([
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
      ]),
    }),
  ),
});

/**
 * Represents a party to a legal case, which can be either a natural person or an organization.
 */
const klageParteiSchema = z.union([naturalPersonSchema, organizationSchema]);

export const klageParteinArraySchema = z.array(klageParteiSchema);

export type KlageParteien = z.infer<typeof klageParteinArraySchema>;
