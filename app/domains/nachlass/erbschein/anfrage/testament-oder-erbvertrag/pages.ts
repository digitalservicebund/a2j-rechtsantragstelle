import { z } from "zod";
import { relationshipToDeceasedSchema } from "~/domains/nachlass/shared/schemas";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { addYears, today } from "~/util/date";

const commonBeguenstigteFields = {
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
  geburtsname: stringOptionalSchema,
  verhaeltnis: relationshipToDeceasedSchema,
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

export const beguenstigtenArray = z.array(
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
    shouldCollapseIntoParentNavItem: true,
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
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "beguenstigten#vorname": commonBeguenstigteFields.vorname,
      "beguenstigten#nachname": commonBeguenstigteFields.nachname,
      "beguenstigten#geburtsname": commonBeguenstigteFields.geburtsname,
    },
  },
  namedBeneficiaryRelationship: {
    stepId: "/testament-oder-erbvertrag/beguenstigten/#/verhaeltnis",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "beguenstigten#verhaeltnis": commonBeguenstigteFields.verhaeltnis,
    },
  },
  namedBeneficiaryBirthday: {
    stepId: "/testament-oder-erbvertrag/beguenstigten/#/geburtsdatum",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "beguenstigten#geburtsdatum": commonBeguenstigteFields.geburtsdatum,
      "beguenstigten#isAlive": commonBeguenstigteFields.isAlive,
    },
  },
  namedBeneficiaryAddress: {
    stepId: "/testament-oder-erbvertrag/beguenstigten/#/anschrift",
    shouldCollapseIntoParentNavItem: true,
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
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "beguenstigten#sterbedatum": deceasedBeguenstigteFields.sterbedatum,
      "beguenstigten#sterbeort": deceasedBeguenstigteFields.sterbeort,
    },
  },
  namedBeneficiariesWarning: {
    stepId: "/testament-oder-erbvertrag/beguenstigten/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
} as const satisfies PageConfigMap;
