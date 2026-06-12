import { z } from "zod";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

export const commonErbausschlagungKinderFields = {
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
  geburtsdatum: createSplitDateSchema({
    earliest: () => addYears(today(), -150),
    latest: () => today(),
  }),
  wohnortBeiAntragsteller: YesNoAnswer.optional(),
  strasse: stringOptionalSchema,
  hausnummer: germanHouseNumberSchema.optional(),
  plz: postcodeSchema.optional(),
  ort: stringOptionalSchema,
  adresseZusatz: stringOptionalSchema,
  optionSorgerecht: z
    .enum(["yes", "shared", "anotherPerson", "anotherOrganization"])
    .optional(),
  hasRenouncedInheritance: YesNoAnswer.optional(),
  vornameSorgerecht: stringOptionalSchema,
  nachnameSorgerecht: stringOptionalSchema,
  geburtsnameSorgerecht: stringOptionalSchema,
  hasSorgerechtSameAddress: YesNoAnswer.optional(),
  strasseSorgerecht: stringOptionalSchema,
  hausnummerSorgerecht: germanHouseNumberSchema.optional(),
  plzSorgerecht: postcodeSchema.optional(),
  ortSorgerecht: stringOptionalSchema,
  adresseZusatzSorgerecht: stringOptionalSchema,
  organizationNameSorgerecht: stringOptionalSchema,
  organizationStrasseSorgerecht: stringOptionalSchema,
  organizationHausnummerSorgerecht: germanHouseNumberSchema.optional(),
  organizationPlzSorgerecht: postcodeSchema.optional(),
  organizationOrtSorgerecht: stringOptionalSchema,
  organizationAdressZusatzSorgerecht: stringOptionalSchema,
};

export const sorgerechtPersonRequired = {
  vornameSorgerecht: stringRequiredSchema,
  nachnameSorgerecht: stringRequiredSchema,
  geburtsnameSorgerecht: stringOptionalSchema,
};

export const sorgerechtPersonAdresseRequired = {
  strasseSorgerecht: stringRequiredSchema,
  hausnummerSorgerecht: germanHouseNumberSchema,
  plzSorgerecht: postcodeSchema,
  ortSorgerecht: stringRequiredSchema,
  adresseZusatzSorgerecht: stringOptionalSchema,
};

export const sorgerechtOrganizationRequired = {
  organizationNameSorgerecht: stringRequiredSchema,
  organizationStrasseSorgerecht: stringRequiredSchema,
  organizationHausnummerSorgerecht: germanHouseNumberSchema,
  organizationPlzSorgerecht: postcodeSchema,
  organizationOrtSorgerecht: stringRequiredSchema,
  organizationAdressZusatzSorgerecht: stringOptionalSchema,
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
  ...commonErbausschlagungKinderFields,
  ...minorChild,
  ...livesSeparately,
  strasse: stringRequiredSchema,
  hausnummer: germanHouseNumberSchema,
  plz: postcodeSchema,
  ort: stringRequiredSchema,
  adresseZusatz: stringOptionalSchema,
};

const minorLivesWithApplicant = {
  ...commonErbausschlagungKinderFields,
  ...minorChild,
  ...livesWithApplicant,
};

export const erbausschlagungKinderArraySchema = z
  .union([
    // Situation 1: Adult child
    z.object({
      ...commonErbausschlagungKinderFields,
      ...adultChild,
      ...livesWithApplicant,
    }),
    z.object({
      ...commonErbausschlagungKinderFields,
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
      optionSorgerecht: z.literal("yes"),
      hasRenouncedInheritance: YesNoAnswer,
    }),
    z.object({
      ...minorLivesSeparately,
      optionSorgerecht: z.literal("shared"),
      ...sorgerechtPersonRequired,
      hasSorgerechtSameAddress: z.literal("yes"),
      hasRenouncedInheritance: YesNoAnswer,
    }),
    z.object({
      ...minorLivesSeparately,
      optionSorgerecht: z.literal("shared"),
      ...sorgerechtPersonRequired,
      hasSorgerechtSameAddress: z.literal("no"),
      ...sorgerechtPersonAdresseRequired,
      hasRenouncedInheritance: YesNoAnswer,
    }),
    z.object({
      ...minorLivesSeparately,
      optionSorgerecht: z.literal("anotherPerson"),
      ...sorgerechtPersonRequired,
      hasSorgerechtSameAddress: z.literal("yes"),
    }),
    z.object({
      ...minorLivesSeparately,
      optionSorgerecht: z.literal("anotherPerson"),
      ...sorgerechtPersonRequired,
      hasSorgerechtSameAddress: z.literal("no"),
      ...sorgerechtPersonAdresseRequired,
    }),
    z.object({
      ...minorLivesSeparately,
      optionSorgerecht: z.literal("anotherOrganization"),
      ...sorgerechtOrganizationRequired,
    }),
    // Situation 3: Minor child living with applicant
    z.object({
      ...minorLivesWithApplicant,
      optionSorgerecht: z.literal("yes"),
      hasRenouncedInheritance: YesNoAnswer,
    }),
    z.object({
      ...minorLivesWithApplicant,
      optionSorgerecht: z.literal("shared"),
      ...sorgerechtPersonRequired,
      hasSorgerechtSameAddress: z.literal("yes"),
      hasRenouncedInheritance: YesNoAnswer,
    }),
    z.object({
      ...minorLivesWithApplicant,
      optionSorgerecht: z.literal("shared"),
      ...sorgerechtPersonRequired,
      hasSorgerechtSameAddress: z.literal("no"),
      ...sorgerechtPersonAdresseRequired,
      hasRenouncedInheritance: YesNoAnswer,
    }),
    z.object({
      ...minorLivesWithApplicant,
      optionSorgerecht: z.literal("anotherPerson"),
      ...sorgerechtPersonRequired,
      hasSorgerechtSameAddress: z.literal("yes"),
    }),
    z.object({
      ...minorLivesWithApplicant,
      optionSorgerecht: z.literal("anotherPerson"),
      ...sorgerechtPersonRequired,
      hasSorgerechtSameAddress: z.literal("no"),
      ...sorgerechtPersonAdresseRequired,
    }),
    z.object({
      ...minorLivesWithApplicant,
      optionSorgerecht: z.literal("anotherOrganization"),
      ...sorgerechtOrganizationRequired,
    }),
  ])
  .array()
  .min(1);
