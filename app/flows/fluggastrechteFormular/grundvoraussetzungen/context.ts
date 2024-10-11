import { z } from "zod";
import { createDateSchema } from "~/services/validation/date";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { addYears, today } from "~/util/date";

const fourYearsAgoSchema = createDateSchema({
  earliest: () => addYears(today(), -4),
  latest: () => today(),
});

export const fluggastrechtGrundvoraussetzungenDaten = {
  zahlungsaufforderung: optionalOrSchema(fourYearsAgoSchema),
};

const _contextObject = z
  .object(fluggastrechtGrundvoraussetzungenDaten)
  .partial();
export type FluggastrechtGrundvoraussetzungenDaten = z.infer<
  typeof _contextObject
>;
