import { z } from "zod";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

// const commonFields = {
//   vorname: stringRequiredSchema,
//   nachname: stringRequiredSchema,
//   geburtsdatum: createSplitDateSchema({
//     earliest: () => addYears(today(), -150),
//     latest: () => today(),
//   }),
//   wohnortBeiAntragsteller: YesNoAnswer,
//   strasse: stringRequiredSchema,
//   hausnummer: germanHouseNumberSchema,
//   plz: postcodeSchema,
//   ort: stringRequiredSchema,
//   adresseZusatz: stringOptionalSchema,
//   optionSorgerecht: z.enum([
//     "yes",
//     "shared",
//     "anotherPerson",
//     "anotherOrganization",
//   ]),
//   hasRenouncedInheritance: YesNoAnswer,
//   vornameSorgerecht: stringRequiredSchema,
//   nachnameSorgerecht: stringRequiredSchema,
//   geburtsnameSorgerecht: stringOptionalSchema,
//   hasSorgerechtSameAddress: YesNoAnswer,
//   strasseSorgerecht: stringRequiredSchema,
//   hausnummerSorgerecht: germanHouseNumberSchema,
//   plzSorgerecht: postcodeSchema,
//   ortSorgerecht: stringRequiredSchema,
//   adresseZusatzSorgerecht: stringOptionalSchema,
//   organizationNameSorgerecht: stringRequiredSchema,
//   organizationStrasseSorgerecht: stringRequiredSchema,
//   organizationHausnummerSorgerecht: germanHouseNumberSchema,
//   organizationPlzSorgerecht: postcodeSchema,
//   organizationOrtSorgerecht: stringRequiredSchema,
//   organizationAdressZusatzSorgerecht: stringOptionalSchema,
// }

const vornameNachname = {
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
};

export const sorgerechtPerson = {
  vornameSorgerecht: stringRequiredSchema,
  nachnameSorgerecht: stringRequiredSchema,
  geburtsnameSorgerecht: stringOptionalSchema,
};

export const sorgerechtPersonAdresse = {
  strasseSorgerecht: stringRequiredSchema,
  hausnummerSorgerecht: germanHouseNumberSchema,
  plzSorgerecht: postcodeSchema,
  ortSorgerecht: stringRequiredSchema,
  adresseZusatzSorgerecht: stringOptionalSchema,
};

const minorChild = {
  geburtsdatum: createSplitDateSchema({
    earliest: () => addYears(today(), -18),
    latest: () => today(),
  }),
};

const adultChild = {
  geburtsdatum: createSplitDateSchema({
    earliest: () => addYears(today(), -150),
    latest: () => addYears(today(), -18),
  }),
};

const livesWithApplicant = {
  wohnortBeiAntragsteller: z.literal("yes"),
};

const livesSeparately = {
  wohnortBeiAntragsteller: z.literal("no"),
};

const minorLivesSeparately = {
  ...vornameNachname,
  ...minorChild,
  ...livesSeparately,
  strasse: stringRequiredSchema,
  hausnummer: germanHouseNumberSchema,
  plz: postcodeSchema,
  ort: stringRequiredSchema,
  adresseZusatz: stringOptionalSchema,
};

const minorLivesWithApplicant = {
  ...vornameNachname,
  ...minorChild,
  ...livesWithApplicant,
};

export const kinderArraySchema = z
  .union([
    // Situation 1: Adult child
    z.object({
      ...vornameNachname,
      ...adultChild,
      ...livesWithApplicant,
    }),
    z.object({
      ...vornameNachname,
      ...adultChild,
      ...livesSeparately,
      strasse: stringOptionalSchema,
      hausnummer: germanHouseNumberSchema.optional(),
      plz: postcodeSchema.optional(),
      ort: stringOptionalSchema,
      adresseZusatz: stringOptionalSchema,
    }),
    // Situation 2: Minor child living separately from applicant
    z.object({
      ...minorLivesSeparately,
      optionSorgeRecht: z.literal("yes"),
      hasRenouncedInheritance: YesNoAnswer,
    }),
    z.object({
      ...minorLivesSeparately,
      optionSorgeRecht: z.literal("shared"),
      ...sorgerechtPerson,
      hasSorgerechtSameAddress: z.literal("yes"),
      hasRenouncedInheritance: YesNoAnswer,
    }),
    z.object({
      ...minorLivesSeparately,
      optionSorgeRecht: z.literal("shared"),
      ...sorgerechtPerson,
      hasSorgerechtSameAddress: z.literal("no"),
      ...sorgerechtPersonAdresse,
      hasRenouncedInheritance: YesNoAnswer,
    }),
    z.object({
      ...minorLivesSeparately,
      optionSorgeRecht: z.literal("anotherPerson"),
      ...sorgerechtPerson,
      hasSorgerechtSameAddress: z.literal("yes"),
    }),
    z.object({
      ...minorLivesSeparately,
      optionSorgeRecht: z.literal("anotherPerson"),
      ...sorgerechtPerson,
      hasSorgerechtSameAddress: z.literal("no"),
      ...sorgerechtPersonAdresse,
    }),
    z.object({
      ...minorLivesSeparately,
      optionSorgeRecht: z.literal("anotherOrganization"),
      organizationNameSorgerecht: stringRequiredSchema,
      organizationStrasseSorgerecht: stringRequiredSchema,
      organizationHausnummerSorgerecht: germanHouseNumberSchema,
      organizationPlzSorgerecht: postcodeSchema,
      organizationOrtSorgerecht: stringRequiredSchema,
      organizationAdressZusatzSorgerecht: stringOptionalSchema,
    }),
    // Situation 3: Minor child living with applicant
    z.object({
      ...minorLivesWithApplicant,
      optionSorgeRecht: z.literal("yes"),
      hasRenouncedInheritance: YesNoAnswer,
    }),
    z.object({
      ...minorLivesWithApplicant,
      optionSorgeRecht: z.literal("shared"),
      ...sorgerechtPerson,
      hasSorgerechtSameAddress: z.literal("yes"),
      hasRenouncedInheritance: YesNoAnswer,
    }),
    z.object({
      ...minorLivesWithApplicant,
      optionSorgeRecht: z.literal("shared"),
      ...sorgerechtPerson,
      hasSorgerechtSameAddress: z.literal("no"),
      ...sorgerechtPersonAdresse,
      hasRenouncedInheritance: YesNoAnswer,
    }),
    z.object({
      ...minorLivesWithApplicant,
      optionSorgeRecht: z.literal("anotherPerson"),
      ...sorgerechtPerson,
      hasSorgerechtSameAddress: z.literal("yes"),
    }),
    z.object({
      ...minorLivesWithApplicant,
      optionSorgeRecht: z.literal("anotherPerson"),
      ...sorgerechtPerson,
      hasSorgerechtSameAddress: z.literal("no"),
      ...sorgerechtPersonAdresse,
    }),
    z.object({
      ...minorLivesWithApplicant,
      optionSorgeRecht: z.literal("anotherOrganization"),
      organizationNameSorgerecht: stringRequiredSchema,
      organizationStrasseSorgerecht: stringRequiredSchema,
      organizationHausnummerSorgerecht: germanHouseNumberSchema,
      organizationPlzSorgerecht: postcodeSchema,
      organizationOrtSorgerecht: stringRequiredSchema,
      organizationAdressZusatzSorgerecht: stringOptionalSchema,
    }),
  ])
  .array()
  .min(1);
