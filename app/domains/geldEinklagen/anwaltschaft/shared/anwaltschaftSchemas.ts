import z from "zod";
import { autoSuggestStringRequiredSchema } from "~/services/validation/autoSuggest";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

const adresseFields = {
  strasse: stringRequiredSchema,
  hausnummer: germanHouseNumberSchema,
  plz: stringRequiredSchema.pipe(postcodeSchema),
  ort: stringRequiredSchema,
  land: autoSuggestStringRequiredSchema("countries"),
};

const personFields = {
  anrede: schemaOrEmptyString(z.enum(["herr", "frau", "none"])),
  titel: stringOptionalSchema,
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
};

const vertretungFields = {
  ...adresseFields,
  ...personFields,
};

/**
 * Represents a party to a legal case, which can be either a natural person or an organization.
 */
const klageParteiSchema = z.union([
  z.object({
    ...adresseFields,
    ...personFields,
    parteiverhaeltnis: z.enum(["klagende", "beklagte"]),
    type: z.literal("naturalPerson"),
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
  }),
  z.object({
    ...adresseFields,
    parteiverhaeltnis: z.enum(["klagende", "beklagte"]),
    type: z.literal("organization"),
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
  }),
]);

export const klageParteinArraySchema = z.array(klageParteiSchema);
