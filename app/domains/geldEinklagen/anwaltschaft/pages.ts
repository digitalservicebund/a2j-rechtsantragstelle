import { z } from "zod";
import { klagendeParteiPages } from "~/domains/geldEinklagen/anwaltschaft/klagende-partei/pages";
import { type PagesConfig } from "~/domains/pageSchemas";
import { autoSuggestStringRequiredSchema } from "~/services/validation/autoSuggest";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import {
  buildMoneyValidationSchema,
  formatCurrencyZodDescription,
} from "~/services/validation/money/buildMoneyValidationSchema";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { abschnitteArray } from "../formular/klage-erstellen/pages";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

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

export const geldEinklagenAnwaltschaftPages = {
  voraussetzungen: {
    stepId: "/voraussetzungen/intro",
  },
  klageInhalt: {
    stepId: "/inhalt-klage",
    pageSchema: {
      zahlungsklageSubjectLine: z
        .string()
        .trim()
        .max(100, { message: "max" })
        .optional(),
      zahlungsklageBezeichnung: z
        .string()
        .trim()
        .max(100, { message: "max" })
        .optional(),
      zahlungsklageNummer: z
        .string()
        .trim()
        .max(50, { message: "max" })
        .optional(),
      zahlungsklageGesamtstreitwert: buildMoneyValidationSchema({
        min: 1,
        max: 1000000,
      }).meta({ description: formatCurrencyZodDescription }),
    },
  },
  pilotgericht: {
    stepId: "/pilotgericht",
    pageSchema: {
      pilotgericht: z.enum([
        "bitburg",
        "bonn",
        "bremen",
        "duesseldorf",
        "eilenburg",
        "erding",
        "essen",
        "frankfurt-am-main",
        "hamburg-mitte",
        "koenigs-wusterhausen",
        "leipzig",
        "mannheim",
        "nuernberg",
        "nuertingen",
        "schoeneberg",
        "sinzig",
        "steinfurt",
      ]),
    },
  },
  ...klagendeParteiPages,
  prozessualeAusfuehrungen: {
    stepId: "/prozessantraege-prozessuale-ausfuehrungen",
    pageSchema: {
      muendlicheVerhandlung: schemaOrEmptyString(checkedOptional),
      videoverhandlung: schemaOrEmptyString(
        z.enum(["yes", "no", "noSpecification"]).optional(),
      ),
      versaeumnisurteil: schemaOrEmptyString(checkedOptional),
    },
  },
  rechtlicheWuerdigung: {
    stepId: "/rechtliche-wuerdigung",
    pageSchema: {
      rechtlicheWuerdigung: schemaOrEmptyString(
        z.string().trim().max(60000, { message: "max" }),
      ),
    },
  },
  beklagte: {
    stepId: "/beklagte-partei/beklagte/uebersicht",
    arraySummary: {
      name: "organisation",
      schema: beklagteOrganisationArray,
      isArrayRelevant: () => true,
    },
  },
  beklagteNatuerlichePerson: {
    stepId: "/beklagte-partei/beklagte/natuerliche-person",
  },
  beklagteOrganisation: {
    stepId: "/beklagte-partei/beklagte/organisation",
  },
  downloadKlage: {
    stepId: "/klage-herunterladen",
  },
} as const satisfies PagesConfig;

export type GeldEinklagenAnwaltschaftPages =
  typeof geldEinklagenAnwaltschaftPages;
