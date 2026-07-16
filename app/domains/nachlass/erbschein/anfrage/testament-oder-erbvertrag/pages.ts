import { z } from "zod";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { addYears, today } from "~/util/date";

const commonBeguenstigteFields = {
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
  geburtsname: stringOptionalSchema,
  verhaeltnis: z.enum([
    "mother-father",
    "daughter-son",
    "grandmother-grandfather",
    "granddaughter-grandson",
    "great-grandmother-great-grandfather",
    "sister-brother",
    "half-sister-half-brother",
    "niece-nephew",
    "aunt-uncle",
    "cousin",
    "great-aunt-great-uncle",
    "wife-husband",
    "life-partner",
    "mother-in-law-father-in-law",
    "sister-in-law-brother-in-law",
    "daughter-in-law-son-in-law",
    "stepmother-stepfather",
    "stepdaughter-stepson",
    "stepsister-stepbrother",
    "foster-mother-foster-father",
    "foster-child",
    "adoptive-mother-adoptive-father",
    "godmother-godfather",
    "other",
    "not-related",
  ]),
  geburtsdatum: createSplitDateSchema({
    earliest: () => addYears(today(), -150),
    latest: () => today(),
  }),
  isAlive: z.enum(["yes", "noButAliveWhenErblasserDied", "no"]),
};

const livingBeguenstigteFields = {
  isAlive: z.enum(["yes", "noButAliveWhenErblasserDied"]),
  strasse: stringRequiredSchema,
  hausnummer: stringRequiredSchema,
  plz: stringRequiredSchema,
  ort: stringRequiredSchema,
  land: stringRequiredSchema,
  adresszusatz: stringOptionalSchema,
};

const deceasedBeguenstigteFields = {
  isAlive: z.literal("no"),
  sterbedatum: createSplitDateSchema({
    earliest: () => addYears(today(), -150),
    latest: () => today(),
  }),
  sterbeort: stringRequiredSchema,
};

const beguenstigtenArray = z.array(
  z.union([
    z.object({
      ...commonBeguenstigteFields,
      ...livingBeguenstigteFields,
    }),
    z.object({
      ...commonBeguenstigteFields,
      ...deceasedBeguenstigteFields,
    }),
  ]),
);

export const testamentOderErbvertragPages = {
  testamentArt: {
    stepId: "/testament-oder-erbvertrag/art",
    pageSchema: {
      testamentArt: z.enum(["none", "handwritten", "notarized", "erbvertrag"]),
    },
  },
  namedBeneficiariesOverview: {
    stepId: "/testament-oder-erbvertrag/beguenstigten/uebersicht",
    arraySummary: {
      name: "beguenstigten",
      schema: beguenstigtenArray,
      isArrayRelevant: (userData) =>
        userData.testamentArt === "handwritten" ||
        userData.testamentArt === "notarized" ||
        userData.testamentArt === "erbvertrag",
    },
  },
  namedBeneficiaryName: {
    stepId: "/testament-oder-erbvertrag/beguenstigten/#/name",
    pageSchema: {
      "beguenstigten#vorname": commonBeguenstigteFields.vorname,
      "beguenstigten#nachname": commonBeguenstigteFields.nachname,
      "beguenstigten#geburtsname": commonBeguenstigteFields.geburtsname,
    },
  },
  namedBeneficiaryRelationship: {
    stepId: "/testament-oder-erbvertrag/beguenstigten/#/verhaeltnis",
    pageSchema: {
      "beguenstigten#verhaeltnis": commonBeguenstigteFields.verhaeltnis,
    },
  },
  namedBeneficiaryBirthday: {
    stepId: "/testament-oder-erbvertrag/beguenstigten/#/geburtsdatum",
    pageSchema: {
      "beguenstigten#geburtsdatum": commonBeguenstigteFields.geburtsdatum,
      "beguenstigten#isAlive": commonBeguenstigteFields.isAlive,
    },
  },
  namedBeneficiaryAddress: {
    stepId: "/testament-oder-erbvertrag/beguenstigten/#/anschrift",
    pageSchema: {
      "beguenstigten#strasse": livingBeguenstigteFields.strasse,
      "beguenstigten#hausnummer": livingBeguenstigteFields.hausnummer,
      "beguenstigten#plz": livingBeguenstigteFields.plz,
      "beguenstigten#ort": livingBeguenstigteFields.ort,
      "beguenstigten#land": livingBeguenstigteFields.land,
      "beguenstigten#adresszusatz": livingBeguenstigteFields.adresszusatz,
    },
  },
  namedBeneficiarySterbedatum: {
    stepId: "/testament-oder-erbvertrag/beguenstigten/#/sterbedatum",
    pageSchema: {
      "beguenstigten#sterbedatum": deceasedBeguenstigteFields.sterbedatum,
      "beguenstigten#sterbeort": deceasedBeguenstigteFields.sterbeort,
    },
  },
  namedBeneficiariesWarning: {
    stepId: "/testament-oder-erbvertrag/beguenstigten/warnung",
  },
} satisfies PageConfigMap;
