import z from "zod";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { addYears, today } from "~/util/date";

const commonAngehoerigeFields = {
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
  geburtsname: stringOptionalSchema,
  geburtsdatum: createSplitDateSchema({
    earliest: () => addYears(today(), -150),
    latest: () => today(),
  }),
  geburtsort: stringRequiredSchema,
  isAlive: z.enum(["yes", "noButAliveWhenErblasserDied", "no"]),
};

const deceasedAngehoerigeFields = {
  isAlive: z.literal("no"),
  sterbedatum: createSplitDateSchema({
    earliest: () => addYears(today(), -150),
    latest: () => today(),
  }),
  sterbeort: stringRequiredSchema,
};

const survivingAngehoerigeFields = {
  isAlive: z.enum(["yes", "noButAliveWhenErblasserDied"]),
  strasse: stringRequiredSchema,
  hausnummer: stringRequiredSchema,
  plz: stringRequiredSchema,
  ort: stringRequiredSchema,
  land: stringRequiredSchema,
  adresszusatz: stringOptionalSchema,
  verhaeltnis: z.enum([
    "not-related",
    "wife-husband",
    "life-partner",
    "daughter-son",
    "granddaughter-grandson",
    "mother-father",
    "sister-brother",
    "half-sister-half-brother",
    "niece-nephew",
    "grandmother-grandfather",
    "aunt-uncle",
    "cousin",
    "great-grandmother-great-grandfather",
    "great-aunt-great-uncle",
    "adoptive-mother-adoptive-father",
    "adoptive-daughter-adoptive-son",
    "other",
  ]),
};

export const angehoerigeArray = z.array(
  z.union([
    z.object({
      ...commonAngehoerigeFields,
      ...deceasedAngehoerigeFields,
    }),
    z.object({
      ...commonAngehoerigeFields,
      ...survivingAngehoerigeFields,
    }),
  ]),
);

export const angehoerigePages = {
  angehoerigeOverview: {
    stepId: "/angehoerige/uebersicht",
    arraySummary: {
      name: "angehoerige",
      schema: angehoerigeArray,
      isArrayRelevant: () => true,
    },
  },
  angehoerigeWarning: {
    stepId: "/angehoerige/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  angehoerigeName: {
    stepId: "/angehoerige/#/name",
    pageSchema: {
      "angehoerige#vorname": commonAngehoerigeFields.vorname,
      "angehoerige#nachname": commonAngehoerigeFields.nachname,
      "angehoerige#geburtsname": commonAngehoerigeFields.geburtsname,
    },
  },
  angehoerigeBirthday: {
    stepId: "/angehoerige/#/geburtsdatum",
    pageSchema: {
      "angehoerige#geburtsdatum": commonAngehoerigeFields.geburtsdatum,
      "angehoerige#geburtsort": commonAngehoerigeFields.geburtsort,
    },
  },
  angehoerigeIsAlive: {
    stepId: "/angehoerige/#/lebend",
    pageSchema: {
      "angehoerige#isAlive": commonAngehoerigeFields.isAlive,
    },
  },
  angehoerigeSterbedatum: {
    stepId: "/angehoerige/#/sterbedatum",
    pageSchema: {
      "angehoerige#sterbedatum": deceasedAngehoerigeFields.sterbedatum,
      "angehoerige#sterbeort": deceasedAngehoerigeFields.sterbeort,
    },
  },
  angehoerigeAddress: {
    stepId: "/angehoerige/#/anschrift",
    pageSchema: {
      "angehoerige#strasse": survivingAngehoerigeFields.strasse,
      "angehoerige#hausnummer": survivingAngehoerigeFields.hausnummer,
      "angehoerige#plz": survivingAngehoerigeFields.plz,
      "angehoerige#ort": survivingAngehoerigeFields.ort,
      "angehoerige#land": survivingAngehoerigeFields.land,
      "angehoerige#adresszusatz": survivingAngehoerigeFields.adresszusatz,
    },
  },
  angehoerigeRelationship: {
    stepId: "/angehoerige/#/verhaeltnis",
    pageSchema: {
      "angehoerige#verhaeltnis": survivingAngehoerigeFields.verhaeltnis,
    },
  },
} as const satisfies PageConfigMap;
