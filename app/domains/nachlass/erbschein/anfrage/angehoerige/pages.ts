import z from "zod";
import { elternteilePages } from "~/domains/nachlass/erbschein/anfrage/angehoerige/elternteil/elternteilePages";
import { kinderPages } from "~/domains/nachlass/erbschein/anfrage/angehoerige/kinder/kinderPages";
import { relationshipToDeceasedSchema } from "~/domains/nachlass/shared/schemas";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
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
  isAlive: YesNoAnswer,
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
  isAlive: z.literal("yes"),
  strasse: stringRequiredSchema,
  hausnummer: stringRequiredSchema,
  plz: stringRequiredSchema,
  ort: stringRequiredSchema,
  land: stringRequiredSchema,
  adresszusatz: stringOptionalSchema,
  verhaeltnis: relationshipToDeceasedSchema,
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

export type Angehoerige = z.infer<typeof angehoerigeArray>[number];

export const angehoerigePages = {
  ...kinderPages,
  ...elternteilePages,
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
