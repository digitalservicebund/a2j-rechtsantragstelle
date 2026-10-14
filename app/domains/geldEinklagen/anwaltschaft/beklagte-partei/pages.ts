import z from "zod";
import { PagesConfig } from "~/domains/pageSchemas";
import { autoSuggestStringRequiredSchema } from "~/services/validation/autoSuggest";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

export const beklagteOrganisationArray = z.array(
  z.object({
    organisationName: stringRequiredSchema,
    strasse: stringRequiredSchema,
    hausnummer: germanHouseNumberSchema,
    plz: stringRequiredSchema.pipe(postcodeSchema),
    ort: stringRequiredSchema,
    land: autoSuggestStringRequiredSchema("countries"),
    vertretungsArt: z.enum([
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
    anrede: schemaOrEmptyString(z.enum(["herr", "frau", "none"])),
    titel: stringOptionalSchema,
    vorname: stringRequiredSchema,
    nachname: stringRequiredSchema,
  }),
);

export const beklagteNatuerlichePersonArray = z.array(
  z.object({
    anrede: schemaOrEmptyString(z.enum(["herr", "frau", "none"])),
    titel: stringOptionalSchema,
    vorname: stringRequiredSchema,
    nachname: stringRequiredSchema,
    strasse: stringRequiredSchema,
    hausnummer: germanHouseNumberSchema,
    plz: stringRequiredSchema.pipe(postcodeSchema),
    ort: stringRequiredSchema,
    land: autoSuggestStringRequiredSchema("countries"),
  }),
);

export const beklagteParteiPages = {
  beklagteUebersicht: {
    stepId: "/beklagte-partei/beklagte/uebersicht",
    arraySummary: {
      name: "beklagteNatuerlichePersonen",
      schema: beklagteNatuerlichePersonArray,
      isArrayRelevant: () => true,
    },
  },
  beklagteNatuerlichePerson: {
    stepId: "/beklagte-partei/beklagte/natuerliche-person",
  },
  beklagteOrganisation: {
    stepId: "/beklagte-partei/beklagte/organisation",
  },
} as const satisfies PagesConfig;

export type BeklagteParteiPages = typeof beklagteParteiPages;
