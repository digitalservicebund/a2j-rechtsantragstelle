import { z } from "zod";
import { createDateSchema } from "~/services/validation/date";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { addYears, today } from "~/util/date";

const fourYearsAgoSchema = createDateSchema({
  earliest: () => addYears(today(), -4),
  latest: () => today(),
});

export const fluggastrechtGrundvorraussetzungenDaten = {
  zahlungsaufforderung: optionalOrSchema(fourYearsAgoSchema),
};

const _contextObject = z
  .object(fluggastrechtGrundvorraussetzungenDaten)
  .partial();
export type FluggastrechtGrundvorraussetzungenDaten = z.infer<
  typeof _contextObject
>;
