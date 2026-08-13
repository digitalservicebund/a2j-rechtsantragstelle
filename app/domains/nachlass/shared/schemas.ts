import z from "zod";

const nachlassRelationshipTypes = [
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
] as const satisfies readonly string[];

export type NachlassRelationshipType =
  (typeof nachlassRelationshipTypes)[number];

export const relationshipToDeceasedSchema = z.enum(nachlassRelationshipTypes);
